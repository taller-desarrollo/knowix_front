import environment from "@/config";

const ENDPOINTS = {
    // TODO: clasify endpoints by feature
    category: `${environment.backendUrl}/api/v1/category`,
    language: `${environment.backendUrl}/api/v1/language`,
    course: `${environment.backendUrl}/api/v1/course`,
    courseImage: `${environment.backendUrl}/api/v1/courseimage`,
    verificationRequest: `${environment.backendUrl}/api/v1/verification-request`,
    user: `${environment.backendUrl}/api/v1/user`,
    purchase: `${environment.backendUrl}/api/v1/purchase`,
    purchaseSeller: `${environment.backendUrl}/api/v1/purchase/seller`,
    reply: `${environment.backendUrl}/api/v1/reply`,
    replyPurchase: `${environment.backendUrl}/api/v1/reply/purchase`,
    paymentMethod: `${environment.backendUrl}/api/v1/paymentmethod`,
    bank: `${environment.backendUrl}/api/v1/bank`,
    accountType: `${environment.backendUrl}/api/v1/accounttype`,
    socialMedia: `${environment.backendUrl}/api/v1/social-media`,
    user: `${environment.backendUrl}/api/v1/user`,
    commentReport: `${environment.backendUrl}/api/v1/comment-report`,
    contentReport: `${environment.backendUrl}/api/v1/content-report`,
    comment: `${environment.backendUrl}/api/v2/comment`,
    courseCreator: (courseId) => `${environment.backendUrl}/api/v1/course/${courseId}/creator`,
    statistics: `${environment.backendUrl}/api/v1/statistics`,

    keycloak: {
        token: `${environment.keycloakUrl}/realms/Knowix/protocol/openid-connect/token`,
    }
}

export default ENDPOINTS;