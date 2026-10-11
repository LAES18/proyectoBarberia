-- PRIVATE SNAPSHOT: existing barberia users only (no haircut/business records).
-- Contains personal data and bcrypt password hashes; keep the GitHub repository private.
-- Import only after db/schema.sql and before the backend's first startup.
-- Regenerate this snapshot when accounts change. Rotate credentials immediately if exposed.
PRAGMA foreign_keys = ON;
BEGIN TRANSACTION;
INSERT INTO users VALUES(1,'admin','admin@barberia.com','$2a$10$TExaN3GW83yHFb1kknglrOnvtzrzTiLt2xTOHwDJzUGLbaRxqNhi2','Administrador','administrador',0.0,1,'2026-02-23 23:17:10.140 +00:00','2026-02-23 23:17:10.140 +00:00');
INSERT INTO users VALUES(2,'Kimberly','kymberly@cobrador.com','$2a$10$t9rkguSLm8mk1BNkWSKOQuKfqsxxUavrj8X.JU7/gYi/m5F3QDxAK','Kimberly Quino','cobrador',50.0,1,'2026-02-26 00:13:37.049 +00:00','2026-02-26 21:04:39.303 +00:00');
INSERT INTO users VALUES(3,'Isai','isai@barbero.com','$2a$10$1RIjcQhpLdVIUx3eEbR9MeEW5.W9JMv7X9fzgSrgJ3qrsX.v7jm42','Isai Manchame','barbero',50.0,1,'2026-02-26 00:14:19.390 +00:00','2026-02-26 20:49:48.875 +00:00');
INSERT INTO users VALUES(4,'Roy','roy@barbero.com','$2a$10$BZPUpWwc.tO2eYJeEWMOFeWY3gd3UYLUzxhYWlfH0H//eG9t6zsnm','Roy Apgao','barbero',50.0,1,'2026-02-26 21:13:48.742 +00:00','2026-10-10 00:15:25.335 +00:00');
INSERT INTO users VALUES(5,'Carlos','carlos@barberi.com','$2a$10$G728SuQ6MuriqU3m7BoQeefs/dFISCdPuQSJO7Qr414WpCqqi5Cr2','Carlos','barbero',50.0,1,'2026-06-20 16:29:51.834 +00:00','2026-06-20 16:29:51.834 +00:00');
COMMIT;
