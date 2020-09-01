export default {
    s3: {
        REGION: "us-east-1",
        BUCKET: "voice-app-audio-thh9501"
    },
    apiGateway: {
        REGION: "us-east-1",
        URL: "https://f6ks25rbg9.execute-api.us-east-1.amazonaws.com/prod"
    },
    cognito: {
        REGION: "us-east-1",
        USER_POOL_ID: "us-east-1_ck6y6ch99",
        APP_CLIENT_ID: "76v6glroo56tuga7rcakh1ftrv",
        IDENTITY_POOL_ID: "us-east-1:c9948028-6be7-4100-a0bc-e52781ee62a4"
    },
    MAX_ATTACHMENT_SIZE: 10000000,
    STRIPE_KEY: "pk_test_RbGyqUNtLADfy0AbvHBnDwVc00B55LwkFH",
};
