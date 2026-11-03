ALTER TABLE IF EXISTS public.asistencia_audit DROP COLUMN IF EXISTS nombreaplicacion;

ALTER TABLE IF EXISTS public.asistencia_audit
    ADD COLUMN IF NOT EXISTS fechahoraentrada_multicausa timestamp without time zone;
ALTER TABLE IF EXISTS public.asistencia_audit
    ADD COLUMN IF NOT EXISTS fechahorasalida_multicausa timestamp without time zone;

ALTER TABLE IF EXISTS public.asistencia_audit
    ADD COLUMN IF NOT EXISTS nombreaplicacion text COLLATE pg_catalog."default";
