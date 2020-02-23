exports.config = {
    SERVER: {
        PORT: 7002,
        HOST_NAME: '127.0.0.1',
    },
    MONGO_DB: {
        DB_USER: '',
        DB_PASSWORD: '',
        DB_IP: '',
        DB_PORT: '',
        DB_NAME: ''
    },
    QINIU: {
        AK: '', // Access Key
        SK: '', // Secret Key
        ZONE: '', // Zone_z0 华东, Zone_z1 华北, Zone_z2 华南, Zone_na0 北美
        BUCKET: '',
        BASE_URL: '', // 用于拼接已上传文件的完整地址
    },
    REDIS: {
        PASSWORD: '',
        IP: '',
        PORT: 6379
    },
    JWT: {
        SECRET: '',
        EXPIRES_IN: ''
    }
}