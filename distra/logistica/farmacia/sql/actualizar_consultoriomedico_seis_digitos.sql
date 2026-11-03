update mod_logfarmacia.dat_tarjetamedicamento
set consultoriomedico = lpad(consultoriomedico::text, 6, '0')
where consultoriomedico is not null 
	and length(consultoriomedico) < 6 ;
