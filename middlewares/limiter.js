import { rateLimit } from 'express-rate-limit'

module.exports = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100,
	standardHeaders: 'draft-7',
	legacyHeaders: false,
})