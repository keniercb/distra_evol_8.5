ALTER TABLE mod_persona.dat_situacionlaboral ADD COLUMN fmodmotivo date; COMMENT ON COLUMN mod_persona.dat_situacionlaboral.fmodmotivo IS 'Fecha en la que se modifica el motivo desde el histórico.';
ALTER TABLE mod_persona.dat_situacionlaboral ADD COLUMN funciones character varying; COMMENT ON COLUMN mod_persona.dat_situacionlaboral.funciones IS 'Funciones especificas del cargo.';
