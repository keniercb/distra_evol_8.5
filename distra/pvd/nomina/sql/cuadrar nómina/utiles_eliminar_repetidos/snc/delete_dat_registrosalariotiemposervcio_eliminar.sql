--salvar eliminados
create table if not exists mod_nomina.dat_registrosalariotiemposervcio_eliminados
	as(
	select * from mod_nomina.dat_registrosalariotiemposervcio where eliminar = 1
	);
	
--delete from mod_nomina.dat_registrosalariotiemposervcio where eliminar = 1;
