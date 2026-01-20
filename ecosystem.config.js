module.exports = {
    apps: [
        {
            name: 'leadify-backend',
            cwd: './backend',
            script: 'node_modules/.bin/nodemon',
            args: '',
            watch: false,
            max_memory_restart: '500M',
            instances: 1,
            autorestart: true,
            max_restarts: 10,
            min_uptime: '10s',
            error_file: '../logs/backend-error.log',
            out_file: '../logs/backend-out.log',
            log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
            restart_delay: 3000,
            env: {
                NODE_ENV: 'development',
                PORT: 3000
            }
        },
        {
            name: 'leadify-frontend',
            cwd: './frontend',
            script: 'node_modules/.bin/nuxt',
            args: 'dev',
            watch: false,
            max_memory_restart: '1G',
            instances: 1,
            autorestart: true,
            max_restarts: 10,
            min_uptime: '10s',
            error_file: '../logs/frontend-error.log',
            out_file: '../logs/frontend-out.log',
            log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
            restart_delay: 3000,
            env: {
                NODE_ENV: 'development',
                PORT: 5000
            }
        }
    ]
};
