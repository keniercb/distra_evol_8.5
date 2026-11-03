alter table mod_datosmaestros.nom_indicadorhoja
	add descripcionventa varchar(255);

comment on column mod_datosmaestros.nom_indicadorhoja.descripcionventa is 'Descripcion para los productos a vender por tienda online o punto de venta con un maximo de 255 caracteres';

