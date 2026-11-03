SELECT fn.idindicador,
MAX(fn.codigo) as codigo,
    MAX(fn.codigoproveedor) as codigoproveedor,
    MAX(fn.denominacion) as denominacion,
    MAX(fn.umedida) as umedida,
    MAX(fn.nacionalidad) as nacionalidad,
    MAX(fn.idproducto) as idproducto,
    SUM(fn.disponible) as disponible,
    SUM(fn.existencia) as existencia,
    SUM(fn.precio) as precio,
    MAX(fn.precioalternativo) as precioalternativo,
    SUM(fn.importetotalcup) as importetotalcup,
    SUM(fn.importetotalcuc) as importetotalcuc,
    MAX(fn.tienelote) as tienelote,
    MAX(fn.equipo) as equipo,
    MAX(fn.municion) as municion,
    MAX(fn.minimo) as minimo,
    MAX(fn.maximo) as maximo,
    --MAX(fn.cuentacontable) as cuentacontable,
	fn.cuentacontable,
    MAX(fn.cuentaalternativa) as cuentaalternativa,
    MAX(fn.nomcategoria) as nomcategoria,
    MAX(fn.decimales) as decimales,
    MIN(fn.fechaminima) as fechaminima,
    MAX(fn.fechamaxima) as fechamaxima,
    MAX(fn.deposito) as deposito,
    MAX(fn.codeposito) as codeposito,
    --MAX(fn.naturaleza) as naturaleza,
	fn.naturaleza,
    MAX(fn.entidad) as entidad,
    MAX(fn.logo) as logo,
    MAX(fn.estadoop) as estadoop,
    MAX(fn.monedacontable) as monedacontable,
    MAX(fn.monedaalternativa) as monedaalternativa,
    SUM(fn.importecalculado) as importecalculado,
    SUM(fn.importealtcalculado) as importealtcalculado,
    MAX(fn.especialidad) as especialidad,
    MAX(fn.imagenesindicador) as imagenesindicador,
    MAX(fn.marca) as marca,
    MAX(fn.modelo) as modelo,
    MAX(fn.ubicacion) as ubicacion,
    SUM(fn.total) as total,
    MAX(fn.idmarca) as idmarca,
    MAX(fn.idmodelo) as idmodelo,
    --MAX(fn.numerolote) as numerolote,
    --MAX(fn.fechavencelote) as fechavencelote,
    MAX(precio_matriz.precioventa) as preciopub FROM mod_loginventario.f_recsub_farmacia (
$P{iddeposito},
$P{codigo},
$P{codigoproveedor},
$P{denominacion},
$P{tipoproducto},
$P{idnaturaleza},
$P{categoria},
$P{idclasifcontable},
$P{idestructuraubic},
$P{disponibilidad},
$P{existencia},
$P{criterio},
$P{cantidadmov},
$P{fechainicio}::date,
$P{fechafin}::date,
$P{monedacontable},
$P{monedaalternativa},
$P{idmarca},
$P{idmodelo},
$P{limit},
$P{start},
$P{criterioavan}) as fn
left join (select
	  mpdm.precioventa
	, mp.idindicador
	, mp.idtipoprecio
	, cf.idpadrematriz
	, cf.idestructuracomun
from mod_logfacturacion.dat_matrizpreciodualmonetaria as mpdm
inner join mod_logfacturacion.dat_matrizprecio as mp on (mp.idmatrizprecio = mpdm.idmatrizprecio)
inner join mod_logfacturacion.conf_configuracionfactura as cf on (cf.idpadrematriz = mp.idestructuracomun)
where 	cf.idestructuracomun = $P{idestructura}
	  	and mp.idtipoprecio = (select idtipoprecio from mod_logfacturacion.nom_tipoprecio
								where tipo = 1 									and es_publico = 1)) as precio_matriz on (precio_matriz.idindicador = fn.idindicador)
group by fn.idindicador, fn.cuentacontable, fn.naturaleza
order by fn.idindicador,fn.cuentacontable, fn.naturaleza
