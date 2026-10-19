package com.meramahan.service;

import com.meramahan.dto.CommentDto;
import com.meramahan.dto.CreateCommentRequest;
import com.meramahan.dto.CreateReportRequest;
import com.meramahan.dto.ReportDto;
import com.meramahan.dto.ReportStatusUpdateRequest;
import com.meramahan.entity.*;
import com.meramahan.repository.*;
import com.meramahan.service.storage.ImageStorageService;
import com.meramahan.service.storage.StorageResult;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReportServiceTest {

    @Mock
    private ReportRepository reportRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private StateRepository stateRepository;

    @Mock
    private CityRepository cityRepository;

    @Mock
    private ReportImageRepository reportImageRepository;

    @Mock
    private ReportLikeRepository reportLikeRepository;

    @Mock
    private CommentRepository commentRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ModerationActionRepository moderationActionRepository;

    @Mock
    private NotificationRepository notificationRepository;

    @Mock
    private ImageStorageService imageStorageService;

    @InjectMocks
    private ReportService reportService;

    private User testUser;
    private Category testCategory;
    private State testState;
    private City testCity;
    private Report testReport;

    @BeforeEach
    void setUp() {
        testUser = new User("citizen@meramahan.in", "pass", Role.ROLE_USER);
        testUser.setId(1L);

        testCategory = new Category("Roads & Potholes", CategoryGroup.PUBLIC_SERVICE, "Potholes");
        testCategory.setId(10L);

        testState = new State("Karnataka", "KA", false);
        testState.setId(20L);

        testCity = new City(testState, "Bengaluru");
        testCity.setId(30L);

        testReport = new Report(testUser, testCategory, "Pothole on Main Road", "Deep pothole causing hazards", testState, testCity, "Near Metro Pillar 50", LocalDate.now());
        testReport.setId(100L);
    }

    @Test
    void testCreateReport_Success() {
        CreateReportRequest request = new CreateReportRequest();
        request.setCategoryId(10L);
        request.setTitle("Pothole on Main Road");
        request.setDescription("Deep pothole causing hazards");
        request.setStateId(20L);
        request.setCityId(30L);
        request.setLocationArea("Near Metro Pillar 50");
        request.setIncidentDate(LocalDate.now());

        MockMultipartFile image = new MockMultipartFile("images", "pothole.jpg", "image/jpeg", new byte[]{1, 2, 3});

        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(categoryRepository.findById(10L)).thenReturn(Optional.of(testCategory));
        when(stateRepository.findById(20L)).thenReturn(Optional.of(testState));
        when(cityRepository.findById(30L)).thenReturn(Optional.of(testCity));
        when(imageStorageService.storeImage(any())).thenReturn(new StorageResult("/uploads/pothole.jpg", "pothole-id"));
        when(reportRepository.save(any(Report.class))).thenAnswer(invocation -> {
            Report r = invocation.getArgument(0);
            r.setId(100L);
            return r;
        });

        ReportDto result = reportService.createReport(request, new MultipartFile[]{image}, 1L);

        assertNotNull(result);
        assertEquals("Pothole on Main Road", result.getTitle());
        assertEquals(ReportStatus.PENDING, result.getStatus());
        verify(reportRepository, times(1)).save(any(Report.class));
        verify(imageStorageService, times(1)).storeImage(any());
    }

    @Test
    void testToggleLike_AddLike() {
        when(reportRepository.findById(100L)).thenReturn(Optional.of(testReport));
        when(reportLikeRepository.findByReportIdAndUserId(100L, 1L)).thenReturn(Optional.empty());
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

        boolean isLiked = reportService.toggleLike(100L, 1L);

        assertTrue(isLiked);
        assertEquals(1, testReport.getLikeCount());
        verify(reportLikeRepository, times(1)).save(any(ReportLike.class));
    }

    @Test
    void testToggleLike_RemoveLike() {
        ReportLike existingLike = new ReportLike(testReport, testUser);
        testReport.setLikeCount(1);

        when(reportRepository.findById(100L)).thenReturn(Optional.of(testReport));
        when(reportLikeRepository.findByReportIdAndUserId(100L, 1L)).thenReturn(Optional.of(existingLike));

        boolean isLiked = reportService.toggleLike(100L, 1L);

        assertFalse(isLiked);
        assertEquals(0, testReport.getLikeCount());
        verify(reportLikeRepository, times(1)).delete(existingLike);
    }

    @Test
    void testAddComment_Success() {
        CreateCommentRequest request = new CreateCommentRequest("Confirming this issue is active.");
        when(reportRepository.findById(100L)).thenReturn(Optional.of(testReport));
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(commentRepository.save(any(Comment.class))).thenAnswer(invocation -> {
            Comment c = invocation.getArgument(0);
            c.setId(500L);
            return c;
        });

        CommentDto result = reportService.addComment(100L, request, 1L);

        assertNotNull(result);
        assertEquals("Confirming this issue is active.", result.getText());
        assertEquals(1, testReport.getCommentCount());
        verify(commentRepository, times(1)).save(any(Comment.class));
    }

    @Test
    void testUpdateStatus_Approve() {
        User moderator = new User("mod@meramahan.in", "pass", Role.ROLE_MODERATOR);
        moderator.setId(2L);

        when(reportRepository.findById(100L)).thenReturn(Optional.of(testReport));
        when(userRepository.findById(2L)).thenReturn(Optional.of(moderator));

        ReportStatusUpdateRequest updateReq = new ReportStatusUpdateRequest(ReportStatus.APPROVED, "Verified by local ward");
        reportService.updateStatus(100L, updateReq, 2L);

        assertEquals(ReportStatus.APPROVED, testReport.getStatus());
        assertTrue(testReport.isPublic());
        verify(moderationActionRepository, times(1)).save(any(ModerationAction.class));
        verify(notificationRepository, times(1)).save(any(Notification.class));
    }
}
