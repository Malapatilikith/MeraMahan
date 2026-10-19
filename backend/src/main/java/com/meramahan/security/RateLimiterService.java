package com.meramahan.security;

import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class RateLimiterService {

    private static class RateWindow {
        final long windowStartEpochSecond;
        final AtomicInteger count;

        RateWindow(long windowStartEpochSecond) {
            this.windowStartEpochSecond = windowStartEpochSecond;
            this.count = new AtomicInteger(1);
        }
    }

    private final Map<String, RateWindow> requestCounts = new ConcurrentHashMap<>();

    /**
     * Check if a request for a key is allowed under maxRequests per windowSeconds.
     * @param key client identifier (e.g. IP + endpoint)
     * @param maxRequests maximum allowed calls in window
     * @param windowSeconds time window in seconds
     * @return true if allowed, false if limit exceeded
     */
    public boolean tryAcquire(String key, int maxRequests, int windowSeconds) {
        long currentEpochSecond = Instant.now().getEpochSecond();
        long windowStart = currentEpochSecond / windowSeconds;
        String bucketKey = key + ":" + windowStart;

        RateWindow window = requestCounts.compute(bucketKey, (k, existing) -> {
            if (existing == null) {
                return new RateWindow(windowStart);
            }
            existing.count.incrementAndGet();
            return existing;
        });

        // Cleanup older entries periodically (e.g. if map exceeds 5000 items)
        if (requestCounts.size() > 5000) {
            long cutoff = windowStart - 2;
            requestCounts.keySet().removeIf(k -> {
                String[] parts = k.split(":");
                if (parts.length >= 2) {
                    try {
                        long w = Long.parseLong(parts[parts.length - 1]);
                        return w < cutoff;
                    } catch (NumberFormatException ignored) {}
                }
                return false;
            });
        }

        return window.count.get() <= maxRequests;
    }
}
