<?php

/**
 *  Esta clase gestiona el acceso a datos de los documentos en proceso
 * @copyright XETID
 * @author Divicion de Gestion de Entidades
 * @version 1.0
 */
class TablerocontrolModel extends BaseModel
{
    private $confreservaService, $estructura;
    public function __construct()
    {
        parent::__construct();
        $this->estructura = $this->estructuraHelper->getEstructura($this->global->Estructura->idestructura);
        if(class_exists('ConfreservaService'))
            $this->confreservaService = new ConfreservaService();
    }

    public function buscarDepositos($id, $cmbService = false)
    {
        $sql = "SELECT deop.idestructuraop,
                       deop.idestructuraop as id,
                       deop.idestructuraop as iddeposito,
                       deop.denominacion as text,
                       deop.denominacion as deposito,
                       'true'::bool as leaf,
                       'false'::bool as checked
              FROM mod_estructuracomp.dat_estructuraop deop
              INNER JOIN mod_estructuracomp.nom_filaestruc nomfila on nomfila.idfila = deop.idestructuraop
              WHERE nomfila.idpadre = {$id} and deop.idconcepto=8
            ORDER BY deop.idestructuraop DESC";
        $result = $this->doctrineHelper->getConnection()->fetchAll($sql);
        $depositos = array();
        foreach ($result as &$datos) {
            $datos['checked'] = $this->existeDepositoReserva($datos['id']);
            if ($cmbService && $datos['checked']) {
                array_push($depositos, $datos);
            }
        }
        if ($cmbService) {
            return $depositos;
        }
        return $result;
    }

    public function existeDepositoReserva($iddeposito)
    {
        $idestructura = $this->global->Estructura->idestructura;
        $query = Doctrine_Query::create()->from('ConfDepositoreserva')
            ->where('idestructuraop = ? AND idestructura = ?', array($iddeposito, $idestructura))
            ->count();
        return $query > 0;
    }

    public function obtenerEstructurasReserva()
    {
        $depositos = Array();
        $estructuras = Array();
        if ($this->estructura[0]->tipo == 'INRE'){
            $estructuras = $this->confreservaService->cargaHijosPorSubordinacion(array('idestructura' => $this->estructura[0]->idestructura));
            foreach ($estructuras  as $est) {
                $empresas =  $this->confreservaService->cargaHijosPorSubordinacion(array('idestructura' => $est['id']));
                $estructuras = array_merge($estructuras, $empresas);
                foreach ($empresas as $emp) {
                    $depositos = array_merge($depositos, $this->buscarDepositos($emp['id'], $cmbService = false));
                }
            }
            $estructuras = array_merge($estructuras, $depositos);
            array_push($estructuras, array('id'=> $this->global->Estructura->idestructura));
        } else {
            $empresas = $this->confreservaService->cargaHijosPorSubordinacion(array('idestructura' => $this->global->estructura->idestructura));
            $estructuras = array_merge($estructuras, $empresas);
            foreach ($empresas as $emp) {
                $depositos = array_merge($depositos, $this->buscarDepositos($emp['id'], $cmbService = false));
            }
            $estructuras = array_merge($estructuras, $depositos);
            array_push($estructuras, array('id'=> $this->global->Estructura->idestructura));
        }
        $arrayestructura = $this->objectHelper->extractValueFromArrayColumn($estructuras, 'id');
        $idestructura = implode(',', $arrayestructura);
        return $idestructura;
    }

    public function getSqlGraficas($parametros){
        if (class_exists('ConfreservaService')){
            $idestructuras = $this->obtenerEstructurasReserva();
            return array_merge($this->getSqlPedidos(), $this->getSqlMovReserva($idestructuras), array());
        }
        else
            return array_merge($this->getSqlPedidos(), array());
    }

    public function getSqlPedidos(){
        $sqlpedido =
            "select coalesce(c.nombre, coalesce(de.denominacion,concat(dp.nombre,' ',dp.snombre,' ',dp.papel,' ',dp.sapel))) as cliente," .
            "sum (pp.cantidad) as cantidad,i.denominacion as denominacion,i.codigo, " .
            "(select coalesce(count(distinct pp1.idproducto),0) from mod_logdistribucion.dat_productopedido pp1 " .
            "inner join mod_logdistribucion.dat_pedido dp1 on dp1.iddocumento = pp1.idpedido " .
            "inner join mod_logistica.dat_documento dd1 on dd1.iddocumento = dp1.iddocumento " .
            "inner join mod_logistica.dat_documentocliente dc1 on dc1.iddocumento = dd1.iddocumento " .
            "where dc1.idcliente = dc.idcliente and dd1.estado in (3,9) and i.idindicador = pp1.idproducto" .
            ") as cantidadprod " .
            "from mod_logdistribucion.dat_pedido pe inner join mod_logistica.dat_documento d on d.iddocumento = pe.iddocumento " .
            "inner join mod_logistica.dat_documentocliente dc on dc.iddocumento = pe.iddocumento " .
            "left join mod_datosmaestros.nom_clientesproveedor c on dc.idcliente = c.idclientesproveedores " .
            "left join mod_estructuracomp.dat_estructura de on de.idestructura = c.idestructura " .
            "left join mod_persona.dat_persona dp on dp.idpersona = c.idpersona " .
            "left join mod_estructuracomp.dat_estructuraop co on dc.idcliente = co.idestructuraop " .
            "inner join mod_logdistribucion.dat_productopedido pp on pp.idpedido = pe.iddocumento " .
            "inner join mod_datosmaestros.nom_indicador i on i.idindicador = pp.idproducto " .
            "where d.estado in (3,9) group by i.denominacion, i.codigo, dc.idcliente, c.nombre, de.denominacion, " .
            "dp.nombre, dp.snombre, dp.papel, dp.sapel, i.idindicador";
        $sqlpedidoprodclit =
            "select distinct coalesce(c.nombre, coalesce(de.denominacion,concat(dp.nombre,' ',dp.snombre,' ',dp.papel,' ',dp.sapel))) as cliente," .
            "(select count(pe1.iddocumento) from mod_logdistribucion.dat_pedido pe1 inner join mod_logistica.dat_documentocliente dc1 on dc1.iddocumento = pe1.iddocumento " .
            "where dc.idcliente = dc1.idcliente) as cantpedida " .
            "from mod_logdistribucion.dat_pedido pe inner join mod_logistica.dat_documento d on d.iddocumento = pe.iddocumento " .
            "inner join mod_logistica.dat_documentocliente dc on dc.iddocumento = pe.iddocumento " .
            "left join mod_datosmaestros.nom_clientesproveedor c on dc.idcliente = c.idclientesproveedores " .
            "left join mod_estructuracomp.dat_estructura de on de.idestructura = c.idestructura " .
            "left join mod_persona.dat_persona dp on dp.idpersona = c.idpersona " .
            "left join mod_estructuracomp.dat_estructuraop co on dc.idcliente = co.idestructuraop " .
            "inner join mod_logdistribucion.dat_productopedido pp on pp.idpedido = pe.iddocumento " .
            "inner join mod_datosmaestros.nom_indicador i on i.idindicador = pp.idproducto " .
            "where d.estado in (3,9) group by i.denominacion, i.codigo, dc.idcliente, c.nombre, de.denominacion," .
            "dp.nombre, dp.snombre, dp.papel, dp.sapel";
        return array('sqlpedido' => "\"" . $sqlpedido . "\"",
            'sqlprodpedcliente' => "\"" . $sqlpedidoprodclit . "\"");
    }


    public function getSqlMovReserva($idestructuras){
        $sql = "select distinct ndp.abreviatura as iddoc, ddp.sigla as documento, " .
            " coalesce((select count(distinct dpc1.idindicador) from mod_datosmaestros.dat_documentoprim ddp1 " .
            "inner join mod_datosmaestros.nom_docprim ndp1 on ndp1.iddocumentos = ddp1.iddocumentos ".
            "inner join mod_logistica.dat_documento dd1 on dd1.iddoc = ddp1.iddoc " .
            "inner join mod_logistica.dat_documentocliente ddc1 on dd1.iddocumento = ddc1.iddocumento " .
            "inner join mod_logreserva.dat_clienteproducto dpc1 on dpc1.iddocumentocliente = ddc1.iddocumentocliente " .
            " where  dd1.estado in (3,4,14,15) and ndp1.abreviatura = ndp.abreviatura AND dd1.idestructuracomun IN (" . $idestructuras . ")),0) as cantidad " .
            "from mod_datosmaestros.dat_documentoprim ddp " .
            "inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos ".
            "inner join mod_logistica.dat_documento dd on dd.iddoc = ddp.iddoc " .
            "inner join mod_logistica.dat_documentocliente ddc on dd.iddocumento = ddc.iddocumento " .
            "inner join mod_logreserva.dat_clienteproducto dpc on dpc.iddocumentocliente = ddc.iddocumentocliente " .
            "where  dd.estado in (3,4,14,15) AND dd.idestructuracomun IN (" . $idestructuras . ")".
            "group by ndp.abreviatura, ddp.sigla " . "union " . "select distinct ndp.abreviatura as iddoc, ddp.sigla as documento, " .
            " coalesce((select count(distinct dpp1.idproducto) from mod_datosmaestros.dat_documentoprim ddp1 " .
            "inner join mod_logistica.dat_documento dd1 on dd1.iddoc = ddp1.iddoc " .
            "inner join mod_logreserva.dat_solicitudprestamo dsp1 on dsp1.idsolicitudprestamo = dd1.iddocumento " .
            "inner join mod_logreserva.dat_productoprestamo dpp1 on dsp1.idsolicitudprestamo = dpp1.idsolicitudprestamo " .
            " where dd1.estado in (3,4,14,15) AND dd1.idestructuracomun IN (" . $idestructuras . ")),0) as cantidad " .
            "from mod_datosmaestros.dat_documentoprim ddp " .
            "inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos ".
            "inner join mod_logistica.dat_documento dd on dd.iddoc = ddp.iddoc " .
            "inner join mod_logreserva.dat_solicitudprestamo dsp on dsp.idsolicitudprestamo = dd.iddocumento " .
            "inner join mod_logreserva.dat_productoprestamo dpp on dsp.idsolicitudprestamo = dpp.idsolicitudprestamo " .
            "where dd.idestructuracomun IN (" . $idestructuras . ")".
            "group by ndp.abreviatura, ddp.sigla " . "union " . "Select distinct q.iddoc, q.sigla as documento, q.cantidad from ( " .
            "                SELECT count(distinct i.idindicador) as cantidad, " .
            "                '1' as iddoc, 'Salida por rotación' as sigla " .
            "                From mod_logistica.dat_movimiento a " .
            "                INNER JOIN mod_logistica.dat_producto dp on a.idproducto = dp.idproducto " .
            "                INNER JOIN mod_datosmaestros.nom_indicador i on dp.idindicador = i.idindicador " .
            "                INNER JOIN mod_datosmaestros.nom_naturaleza b on b.idnaturaleza = i.idnaturaleza " .
            "                INNER JOIN mod_logreserva.conf_cuadrobasico z on z.idindicador = i.idindicador " .
            "                INNER JOIN mod_logfacturacion.dat_docfactura df on df.idfactura = a.iddocumento " .
            "                INNER JOIN mod_logistica.dat_documento ddto on df.idfactura = ddto.iddocumento " .
            "                INNER JOIN mod_logistica.dat_documento d on d.iddocumento = a.iddocumento " .
            "                INNER JOIN mod_logistica.dat_documentopadre ddp on ddp.iddocumento = a.iddocumento " .
            "                INNER JOIN mod_logreserva.dat_rotacion dr on dr.iddistribucion = ddp.idpadre " .
            "                INNER JOIN mod_datosmaestros.dat_documentoprim p on d.iddoc = p.iddoc " .
            "                INNER JOIN mod_estructuracomp.dat_estructura r on r.idestructura = dp.idestructuracomun " .
            "                INNER JOIN mod_logistica.dat_documentocliente c on c.idcliente = df.idcliente " .
            "                INNER JOIN mod_datosmaestros.nom_clientesproveedor m on m.idclientesproveedores = c.idcliente " .
            "                INNER Join mod_estructuracomp.dat_estructura r1 on r1.idestructura = m.idestructura " .
            "                AND d.idestructuracomun IN (" . $idestructuras . ") " .
            "	        WHERE d.estado IN(3,4,14,15) " . "                union " .
            "                SELECT count(distinct i.idindicador) as cantidad, " .
            "                '2' as iddoc, 'Salida por préstamo' as sigla " .
            "                From mod_logistica.dat_movimiento a " .
            "                INNER JOIN mod_logistica.dat_producto dp on a.idproducto = dp.idproducto " .
            "                INNER JOIN mod_datosmaestros.nom_indicador i on dp.idindicador = i.idindicador " .
            "                INNER JOIN mod_datosmaestros.nom_naturaleza b on b.idnaturaleza = i.idnaturaleza " .
            "                INNER JOIN mod_logreserva.conf_cuadrobasico z on z.idindicador = i.idindicador " .
            "                INNER JOIN mod_logfacturacion.dat_docfactura df on df.idfactura = a.iddocumento " .
            "                INNER JOIN mod_logistica.dat_documento ddto on df.idfactura = ddto.iddocumento " .
            "                INNER JOIN mod_logistica.dat_documento d on d.iddocumento = a.iddocumento " .
            "                INNER JOIN mod_logistica.dat_documentopadre ddp on ddp.iddocumento = a.iddocumento " .
            "                INNER JOIN mod_logdistribucion.dat_distribucion dd on dd.iddistribucion = ddp.idpadre " .
            "                INNER JOIN mod_logistica.dat_documentopadre ddp1 on ddp1.iddocumento = dd.iddistribucion " .
            "                INNER JOIN mod_logreserva.dat_solicitudprestamo dsp on dsp.idsolicitudprestamo = ddp1.idpadre " .
            "                INNER JOIN mod_logreserva.dat_productoprestamo dpp on  dpp.idsolicitudprestamo = dsp.idsolicitudprestamo " .
            "                INNER JOIN mod_logreserva.dat_depositario t on dpp.idproductoprestamo = t.idclienteproducto " .
            "                INNER JOIN mod_datosmaestros.dat_documentoprim p on d.iddoc = p.iddoc " .
            "                INNER JOIN mod_estructuracomp.dat_estructura r on r.idestructura = dp.idestructuracomun " .
            "               INNER JOIN mod_logistica.dat_documentocliente c on c.idcliente = df.idcliente " .
            "               INNER JOIN mod_datosmaestros.nom_clientesproveedor m on m.idclientesproveedores = c.idcliente " .
            "               INNER JOIN mod_estructuracomp.dat_estructura r1 on r1.idestructura = m.idestructura " .
            "                AND d.idestructuracomun IN (" . $idestructuras . ") " .
            "		WHERE d.estado IN(3,4,14,15) " . "union " .
            "                SELECT count(distinct i.idindicador) as cantidad, " .
            "                '3' as iddoc, 'Salida por cambio de surtido Definitivo' as sigla " .
            "                From mod_logistica.dat_movimiento a " .
            "                INNER JOIN mod_logistica.dat_producto dp on a.idproducto = dp.idproducto " .
            "                INNER JOIN mod_datosmaestros.nom_indicador i on dp.idindicador = i.idindicador " .
            "                INNER JOIN mod_datosmaestros.nom_naturaleza b on b.idnaturaleza = i.idnaturaleza " .
            "                INNER JOIN mod_logreserva.conf_cuadrobasico z on z.idindicador = i.idindicador " .
            "                INNER JOIN mod_logfacturacion.dat_docfactura df on df.idfactura = a.iddocumento " .
            "                INNER JOIN mod_logistica.dat_documento ddto on df.idfactura = ddto.iddocumento " .
            "                INNER JOIN mod_logistica.dat_documentopadre ddp on ddp.iddocumento = a.iddocumento " .
            "                INNER JOIN mod_logdistribucion.dat_distribucion dd on dd.iddistribucion = ddp.idpadre " .
            "                INNER JOIN mod_logistica.dat_documentopadre ddp1 on ddp1.iddocumento = dd.iddistribucion " .
            "                INNER JOIN mod_logistica.dat_documento d on d.iddocumento = ddp1.idpadre " .
            "                INNER JOIN mod_logreserva.dat_solicitudcambio dsc on dsc.idsolicitudcambio = d.iddocumento " .
            "                INNER JOIN mod_datosmaestros.dat_documentoprim p on d.iddoc = p.iddoc " .
            "                INNER JOIN mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = p.iddocumentos " .
            "                INNER JOIN mod_estructuracomp.dat_estructura r on r.idestructura = dp.idestructuracomun " .
            "                INNER JOIN mod_logistica.dat_documentocliente c on c.idcliente = df.idcliente " .
            "                INNER JOIN mod_logreserva.dat_clienteproducto dcp on dcp.iddocumentocliente = c.iddocumentocliente " .
            "                INNER JOIN mod_logreserva.dat_depositario t on dcp.idclienteproducto = t.idclienteproducto " .
            "                INNER JOIN mod_datosmaestros.nom_clientesproveedor m on m.idclientesproveedores = c.idcliente " .
            "                INNER JOIN mod_estructuracomp.dat_estructura r1 on r1.idestructura = m.idestructura " .
            "                INNER JOIN mod_estructuracomp.nom_filaestruc f1 on t.iddelegacion = f1.idfila " .
            "                INNER JOIN mod_estructuracomp.dat_estructura r2 on r2.idestructura = f1.idfila " .
            "                AND d.idestructuracomun IN (" . $idestructuras .
            ") AND ndp.abreviatura = 'solicitudCS' AND dsc.tipocambio = 2 " .
            "		WHERE d.estado IN(3,4,14,15) " . "union " .
            "                SELECT count(distinct i.idindicador) as cantidad, " .
            "                '3' as iddoc, 'Salida por cambio de surtido Temporal' as sigla " .
            "                From mod_logistica.dat_movimiento a " .
            "                INNER JOIN mod_logistica.dat_producto dp on a.idproducto = dp.idproducto " .
            "                INNER JOIN mod_datosmaestros.nom_indicador i on dp.idindicador = i.idindicador " .
            "                INNER JOIN mod_datosmaestros.nom_naturaleza b on b.idnaturaleza = i.idnaturaleza " .
            "                INNER JOIN mod_logreserva.conf_cuadrobasico z on z.idindicador = i.idindicador " .
            "                INNER JOIN mod_logfacturacion.dat_docfactura df on df.idfactura = a.iddocumento " .
            "                INNER JOIN mod_logistica.dat_documento ddto on df.idfactura = ddto.iddocumento " .
            "                INNER JOIN mod_logistica.dat_documentopadre ddp on ddp.iddocumento = a.iddocumento " .
            "                INNER JOIN mod_logdistribucion.dat_distribucion dd on dd.iddistribucion = ddp.idpadre " .
            "                INNER JOIN mod_logistica.dat_documentopadre ddp1 on ddp1.iddocumento = dd.iddistribucion " .
            "                INNER JOIN mod_logistica.dat_documento d on d.iddocumento = ddp1.idpadre " .
            "                INNER JOIN mod_logreserva.dat_solicitudcambio dsc on dsc.idsolicitudcambio = d.iddocumento " .
            "                INNER JOIN mod_datosmaestros.dat_documentoprim p on d.iddoc = p.iddoc " .
            "                INNER JOIN mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = p.iddocumentos " .
            "                INNER JOIN mod_estructuracomp.dat_estructura r on r.idestructura = dp.idestructuracomun " .
            "                INNER JOIN mod_logistica.dat_documentocliente c on c.idcliente = df.idcliente " .
            "                INNER JOIN mod_logreserva.dat_clienteproducto dcp on dcp.iddocumentocliente = c.iddocumentocliente " .
            "                INNER JOIN mod_logreserva.dat_depositario t on dcp.idclienteproducto = t.idclienteproducto " .
            "                INNER JOIN mod_datosmaestros.nom_clientesproveedor m on m.idclientesproveedores = c.idcliente " .
            "                INNER JOIN mod_estructuracomp.dat_estructura r1 on r1.idestructura = m.idestructura " .
            "                INNER JOIN mod_estructuracomp.nom_filaestruc f1 on t.iddelegacion = f1.idfila " .
            "                INNER JOIN mod_estructuracomp.dat_estructura r2 on r2.idestructura = f1.idfila " .
            "                AND d.idestructuracomun IN (" . $idestructuras .
            ") AND ndp.abreviatura = 'solicitudCS' AND dsc.tipocambio = 1 " .
            "		WHERE d.estado IN(3,4,14,15) " . "                union " . "                SELECT " .
            "                count(distinct i.idindicador) as cantidad, " .
            "                '5' as iddoc, 'Salida por cambio de ubicación Definitivo' as sigla " .
            "                From mod_logistica.dat_movimiento a " .
            "                INNER JOIN mod_logistica.dat_producto dp on a.idproducto = dp.idproducto " .
            "                INNER JOIN mod_datosmaestros.nom_indicador i on dp.idindicador = i.idindicador " .
            "                INNER JOIN mod_datosmaestros.nom_naturaleza b on b.idnaturaleza = i.idnaturaleza " .
            "                INNER JOIN mod_logreserva.conf_cuadrobasico z on z.idindicador = i.idindicador " .
            "                INNER JOIN mod_logfacturacion.dat_docfactura df on df.idfactura = a.iddocumento " .
            "                INNER JOIN mod_logistica.dat_documento ddto on df.idfactura = ddto.iddocumento " .
            "                INNER JOIN mod_logistica.dat_documentopadre ddp on ddp.iddocumento = a.iddocumento " .
            "                INNER JOIN mod_logdistribucion.dat_distribucion dd on dd.iddistribucion = ddp.idpadre " .
            "               INNER JOIN mod_logistica.dat_documentopadre ddp1 on ddp1.iddocumento = dd.iddistribucion " .
            "                INNER JOIN mod_logistica.dat_documento d on d.iddocumento = ddp1.idpadre " .
            "                INNER JOIN mod_logreserva.dat_solicitudcambio dsc on dsc.idsolicitudcambio = d.iddocumento " .
            "                INNER JOIN mod_datosmaestros.dat_documentoprim p on d.iddoc = p.iddoc " .
            "                INNER JOIN mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = p.iddocumentos " .
            "                INNER JOIN mod_estructuracomp.dat_estructura r on r.idestructura = dp.idestructuracomun " .
            "                INNER JOIN mod_logistica.dat_documentocliente c on c.idcliente = df.idcliente " .
            "                INNER JOIN mod_logreserva.dat_clienteproducto dcp on dcp.iddocumentocliente = c.iddocumentocliente " .
            "                INNER JOIN mod_logreserva.dat_depositario t on dcp.idclienteproducto = t.idclienteproducto " .
            "                INNER JOIN mod_datosmaestros.nom_clientesproveedor m on m.idclientesproveedores = c.idcliente " .
            "                INNER JOIN mod_estructuracomp.dat_estructura r1 on r1.idestructura = m.idestructura " .
            "                INNER JOIN mod_estructuracomp.nom_filaestruc f1 on t.iddelegacion = f1.idfila " .
            "                INNER JOIN mod_estructuracomp.dat_estructura r2 on r2.idestructura = f1.idfila " .
            "                AND d.idestructuracomun IN (" . $idestructuras .
            ") AND ndp.abreviatura = 'cambioubicLog' AND dsc.tipocambio = 2 " .
            "		WHERE d.estado IN(3,4,14,15) " . "                union " . "                SELECT " .
            "                count(distinct i.idindicador) as cantidad, " .
            "                '6' as iddoc, 'Salida por cambio de ubicación Temporal' as sigla " .
            "                From mod_logistica.dat_movimiento a " .
            "                INNER JOIN mod_logistica.dat_producto dp on a.idproducto = dp.idproducto " .
            "                INNER JOIN mod_datosmaestros.nom_indicador i on dp.idindicador = i.idindicador " .
            "                INNER JOIN mod_datosmaestros.nom_naturaleza b on b.idnaturaleza = i.idnaturaleza " .
            "                INNER JOIN mod_logreserva.conf_cuadrobasico z on z.idindicador = i.idindicador " .
            "                INNER JOIN mod_logfacturacion.dat_docfactura df on df.idfactura = a.iddocumento " .
            "                INNER JOIN mod_logistica.dat_documento ddto on df.idfactura = ddto.iddocumento " .
            "                INNER JOIN mod_logistica.dat_documentopadre ddp on ddp.iddocumento = a.iddocumento " .
            "                INNER JOIN mod_logdistribucion.dat_distribucion dd on dd.iddistribucion = ddp.idpadre " .
            "               INNER JOIN mod_logistica.dat_documentopadre ddp1 on ddp1.iddocumento = dd.iddistribucion " .
            "                INNER JOIN mod_logistica.dat_documento d on d.iddocumento = ddp1.idpadre " .
            "                INNER JOIN mod_logreserva.dat_solicitudcambio dsc on dsc.idsolicitudcambio = d.iddocumento " .
            "                INNER JOIN mod_datosmaestros.dat_documentoprim p on d.iddoc = p.iddoc " .
            "                INNER JOIN mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = p.iddocumentos " .
            "                INNER JOIN mod_estructuracomp.dat_estructura r on r.idestructura = dp.idestructuracomun " .
            "                INNER JOIN mod_logistica.dat_documentocliente c on c.idcliente = df.idcliente " .
            "                INNER JOIN mod_logreserva.dat_clienteproducto dcp on dcp.iddocumentocliente = c.iddocumentocliente " .
            "                INNER JOIN mod_logreserva.dat_depositario t on dcp.idclienteproducto = t.idclienteproducto " .
            "                INNER JOIN mod_datosmaestros.nom_clientesproveedor m on m.idclientesproveedores = c.idcliente " .
            "                INNER JOIN mod_estructuracomp.dat_estructura r1 on r1.idestructura = m.idestructura " .
            "                INNER JOIN mod_estructuracomp.nom_filaestruc f1 on t.iddelegacion = f1.idfila " .
            "                INNER JOIN mod_estructuracomp.dat_estructura r2 on r2.idestructura = f1.idfila " .
            "                AND d.idestructuracomun IN (" . $idestructuras .
            ") AND ndp.abreviatura = 'cambioubicLog' AND dsc.tipocambio = 1 " .
            "		WHERE d.estado IN(3,4,14,15) " . "union " . "                SELECT " .
            "               count(distinct i.idindicador) as cantidad, " .
            "                '7' as iddoc, 'Salida por liberación' as sigla " .
            "                From mod_logistica.dat_movimiento a " .
            "                INNER JOIN mod_logistica.dat_producto dp on a.idproducto = dp.idproducto " .
            "                INNER JOIN mod_datosmaestros.nom_indicador i on dp.idindicador = i.idindicador " .
            "                INNER JOIN mod_datosmaestros.nom_naturaleza b on b.idnaturaleza = i.idnaturaleza " .
            "                INNER JOIN mod_logreserva.conf_cuadrobasico z on z.idindicador = i.idindicador " .
            "                INNER JOIN mod_logfacturacion.dat_docfactura df on df.idfactura = a.iddocumento " .
            "                INNER JOIN mod_logistica.dat_documento ddto on df.idfactura = ddto.iddocumento " .
            "                INNER JOIN mod_logistica.dat_documentopadre ddp on ddp.iddocumento = a.iddocumento " .
            "                INNER JOIN mod_logdistribucion.dat_distribucion dd on dd.iddistribucion = ddp.idpadre " .
            "                INNER JOIN mod_logistica.dat_documentopadre ddp1 on ddp1.iddocumento = dd.iddistribucion " .
            "                INNER JOIN mod_logistica.dat_documento d on d.iddocumento = ddp1.idpadre " .
            "                INNER JOIN mod_logreserva.dat_solicitudcambio dsc on dsc.idsolicitudcambio = d.iddocumento " .
            "                INNER JOIN mod_datosmaestros.dat_documentoprim p on d.iddoc = p.iddoc " .
            "                INNER JOIN mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = p.iddocumentos " .
            "                INNER JOIN mod_estructuracomp.dat_estructura r on r.idestructura = dp.idestructuracomun " .
            "                INNER JOIN mod_logistica.dat_documentocliente c on c.idcliente = df.idcliente " .
            "                INNER JOIN mod_logreserva.dat_clienteproducto dcp on dcp.iddocumentocliente = c.iddocumentocliente " .
            "                INNER JOIN mod_logreserva.dat_depositario t on dcp.idclienteproducto = t.idclienteproducto " .
            "                INNER JOIN mod_datosmaestros.nom_clientesproveedor m on m.idclientesproveedores = c.idcliente " .
            "                INNER JOIN mod_estructuracomp.dat_estructura r1 on r1.idestructura = m.idestructura " .
            "                INNER JOIN mod_estructuracomp.nom_filaestruc f1 on t.iddelegacion = f1.idfila " .
            "                INNER JOIN mod_estructuracomp.dat_estructura r2 on r2.idestructura = f1.idfila " .
            "                AND d.idestructuracomun IN (" . $idestructuras .
            ") AND ndp.abreviatura = 'solicitudlcLog' AND dsc.tipocambio = 2 " .
            "		WHERE d.estado IN(3,4,14,15) " . "                union " . "                SELECT " .
            "                count(distinct i.idindicador) as cantidad, " .
            "                '8' as iddoc, 'Salida por comercialización' as sigla " .
            "                From mod_logistica.dat_movimiento a " .
            "                INNER JOIN mod_logistica.dat_producto dp on a.idproducto = dp.idproducto " .
            "                INNER JOIN mod_datosmaestros.nom_indicador i on dp.idindicador = i.idindicador " .
            "                INNER JOIN mod_datosmaestros.nom_naturaleza b on b.idnaturaleza = i.idnaturaleza " .
            "                INNER JOIN mod_logreserva.conf_cuadrobasico z on z.idindicador = i.idindicador " .
            "                INNER JOIN mod_logfacturacion.dat_docfactura df on df.idfactura = a.iddocumento " .
            "                INNER JOIN mod_logistica.dat_documento ddto on df.idfactura = ddto.iddocumento " .
            "                INNER JOIN mod_logistica.dat_documentopadre ddp on ddp.iddocumento = a.iddocumento " .
            "                INNER JOIN mod_logdistribucion.dat_distribucion dd on dd.iddistribucion = ddp.idpadre " .
            "                INNER JOIN mod_logistica.dat_documentopadre ddp1 on ddp1.iddocumento = dd.iddistribucion " .
            "                INNER JOIN mod_logistica.dat_documento d on d.iddocumento = ddp1.idpadre " .
            "                INNER JOIN mod_logreserva.dat_solicitudcambio dsc on dsc.idsolicitudcambio = d.iddocumento " .
            "                INNER JOIN mod_datosmaestros.dat_documentoprim p on d.iddoc = p.iddoc " .
            "                INNER JOIN mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = p.iddocumentos " .
            "                INNER JOIN mod_estructuracomp.dat_estructura r on r.idestructura = dp.idestructuracomun " .
            "                INNER JOIN mod_logistica.dat_documentocliente c on c.idcliente = df.idcliente " .
            "                INNER JOIN mod_logreserva.dat_clienteproducto dcp on dcp.iddocumentocliente = c.iddocumentocliente " .
            "                INNER JOIN mod_logreserva.dat_depositario t on dcp.idclienteproducto = t.idclienteproducto " .
            "                INNER JOIN mod_datosmaestros.nom_clientesproveedor m on m.idclientesproveedores = c.idcliente " .
            "                INNER JOIN mod_estructuracomp.dat_estructura r1 on r1.idestructura = m.idestructura " .
            "                INNER JOIN mod_estructuracomp.nom_filaestruc f1 on t.iddelegacion = f1.idfila " .
            "                INNER JOIN mod_estructuracomp.dat_estructura r2 on r2.idestructura = f1.idfila " .
            "                AND d.idestructuracomun IN (" . $idestructuras .
            ") AND ndp.abreviatura = 'solicitudlcLog' AND dsc.tipocambio = 1 " .
            "		WHERE d.estado IN(3,4,14,15) " . "union " . "               SELECT " .
            "                count(distinct i.idindicador) as cantidad, " .
            "                '9' as iddoc, 'Salida por faltante' as sigla " .
            "                From mod_logistica.dat_movimiento a " .
            "                INNER JOIN mod_logistica.dat_producto dp on a.idproducto = dp.idproducto " .
            "                INNER JOIN mod_datosmaestros.nom_indicador i on dp.idindicador = i.idindicador " .
            "                INNER JOIN mod_datosmaestros.nom_naturaleza b on b.idnaturaleza = i.idnaturaleza " .
            "                INNER JOIN mod_logreserva.conf_cuadrobasico z on z.idindicador = i.idindicador " .
            "                INNER JOIN mod_logistica.dat_documento d on d.iddocumento = a.iddocumento " .
            "                INNER JOIN mod_loginventario.dat_ajuste dai on dai.idajuste = d.iddocumento " .
            "                INNER JOIN mod_datosmaestros.nom_operacion no on no.idnomoperaciones = dai.idoperacion " .
            "                INNER JOIN mod_datosmaestros.dat_documentoprim p on d.iddoc = p.iddoc " .
            "                INNER JOIN mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = p.iddocumentos " .
            "                INNER JOIN mod_estructuracomp.dat_estructura r on r.idestructura = dp.idestructuracomun " .
            "                INNER JOIN mod_logistica.dat_documentocliente c on c.iddocumento = d.iddocumento " .
            "                INNER JOIN mod_datosmaestros.nom_clientesproveedor m on m.idclientesproveedores = c.idcliente " .
            "                INNER JOIN mod_estructuracomp.dat_estructura r1 on r1.idestructura = m.idestructura " .
            "                AND d.idestructuracomun IN (" . $idestructuras .
            ") AND no.codigooperacion = 'OPER_INV_FALTANTE' " . "		WHERE d.estado IN(3,4,14,15) " .
            "                union " . "                SELECT " .
            "                count(distinct i.idindicador) as cantidad, " .
            "                '10' as iddoc, 'Entrada por rotacion' as sigla " .
            "                 From mod_logistica.dat_movimiento a " .
            "                INNER JOIN mod_logistica.dat_producto dp on a.idproducto = dp.idproducto " .
            "                INNER JOIN mod_datosmaestros.nom_indicador i on dp.idindicador = i.idindicador " .
            "                INNER JOIN mod_datosmaestros.nom_naturaleza b on b.idnaturaleza = i.idnaturaleza " .
            "                INNER JOIN mod_logreserva.conf_cuadrobasico z on z.idindicador = i.idindicador " .
            "                INNER JOIN mod_logistica.dat_documento d on d.iddocumento = a.iddocumento " .
            "                INNER JOIN mod_loginventario.dat_recepcion dr on dr.iddocumento = d.iddocumento " .
            "                INNER JOIN mod_logreserva.dat_recepcionreserva da on da.iddocumento = d.iddocumento " .
            "                INNER JOIN mod_datosmaestros.dat_documentoprim p on d.iddoc = p.iddoc " .
            "                INNER JOIN mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = p.iddocumentos " .
            "                INNER JOIN mod_estructuracomp.dat_estructura r on r.idestructura = dp.idestructuracomun " .
            "                INNER JOIN mod_logistica.dat_documentocliente c on c.iddocumento = d.iddocumento " .
            "                INNER JOIN mod_datosmaestros.nom_clientesproveedor m on m.idclientesproveedores = c.idcliente " .
            "                INNER JOIN mod_estructuracomp.dat_estructura r1 on r1.idestructura = m.idestructura " .
            "                AND d.idestructuracomun IN (" . $idestructuras . ") AND da.concepto = 7 " .
            "		WHERE d.estado IN(3,4,14,15) " . "             union  " .
            "               SELECT count(distinct i.idindicador) as cantidad,  " .
            "                            '11' as iddoc, 'Entrada por pago de prestamo' as sigla  " .
            "                From mod_logistica.dat_movimiento a " .
            "                INNER JOIN mod_logistica.dat_producto dp on a.idproducto = dp.idproducto " .
            "                INNER JOIN mod_datosmaestros.nom_indicador i on dp.idindicador = i.idindicador " .
            "                INNER JOIN mod_datosmaestros.nom_naturaleza b on b.idnaturaleza = i.idnaturaleza " .
            "                INNER JOIN mod_logreserva.conf_cuadrobasico z on z.idindicador = i.idindicador " .
            "                INNER JOIN mod_logistica.dat_documento d on d.iddocumento = a.iddocumento " .
            "                INNER JOIN mod_loginventario.dat_recepcion dr on dr.iddocumento = d.iddocumento " .
            "                INNER JOIN mod_logreserva.dat_recepcionreserva da on da.iddocumento = d.iddocumento " .
            "                INNER JOIN mod_datosmaestros.dat_documentoprim p on d.iddoc = p.iddoc " .
            "                INNER JOIN mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = p.iddocumentos " .
            "                INNER JOIN mod_estructuracomp.dat_estructura r on r.idestructura = dp.idestructuracomun " .
            "                INNER JOIN mod_logistica.dat_documentocliente c on c.iddocumento = d.iddocumento " .
            "                INNER JOIN mod_datosmaestros.nom_clientesproveedor m on m.idclientesproveedores = c.idcliente " .
            "                INNER JOIN mod_estructuracomp.dat_estructura r1 on r1.idestructura = m.idestructura " .
            "                AND d.idestructuracomun IN (" . $idestructuras . ") AND da.concepto = 1  " .
            "		WHERE d.estado IN(3,4,14,15) " .
            "                union " .
            "                SELECT count(distinct i.idindicador) as cantidad,  " .
            "                            '12' as iddoc, 'Entrada por acumulación de gravamen' as sigla  " .
            "                 From mod_logistica.dat_movimiento a " .
            "                INNER JOIN mod_logistica.dat_producto dp on a.idproducto = dp.idproducto " .
            "                INNER JOIN mod_datosmaestros.nom_indicador i on dp.idindicador = i.idindicador " .
            "                INNER JOIN mod_datosmaestros.nom_naturaleza b on b.idnaturaleza = i.idnaturaleza " .
            "                INNER JOIN mod_logreserva.conf_cuadrobasico z on z.idindicador = i.idindicador " .
            "                INNER JOIN mod_logistica.dat_documento d on d.iddocumento = a.iddocumento " .
            "                INNER JOIN mod_loginventario.dat_recepcion dr on dr.iddocumento = d.iddocumento " .
            "                INNER JOIN mod_logreserva.dat_recepcionreserva da on da.iddocumento = d.iddocumento " .
            "                INNER JOIN mod_datosmaestros.dat_documentoprim p on d.iddoc = p.iddoc " .
            "                INNER JOIN mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = p.iddocumentos " .
            "                INNER JOIN mod_estructuracomp.dat_estructura r on r.idestructura = dp.idestructuracomun " .
            "                INNER JOIN mod_logistica.dat_documentocliente c on c.iddocumento = d.iddocumento " .
            "                INNER JOIN mod_logreserva.dat_clientegravamen dcg on dcg.iddocumentocliente = c.iddocumentocliente " .
            "                INNER JOIN mod_datosmaestros.nom_clientesproveedor m on m.idclientesproveedores = c.idcliente " .
            "                INNER JOIN mod_estructuracomp.dat_estructura r1 on r1.idestructura = m.idestructura " .
            "                AND d.idestructuracomun IN (" . $idestructuras .
            ") AND da.concepto = 1 AND (dcg.gravamen = 1 OR dcg.gravamenprorroga = 1) " .
            "		WHERE d.estado IN(3,4,14,15) " .
            "                union " .
            "                SELECT count(distinct i.idindicador) as cantidad,  " .
            "                            '13' as iddoc, 'Entrada por cambio de surtido Temporal' as sigla  " .
            "                 From mod_logistica.dat_movimiento a " .
            "                INNER JOIN mod_logistica.dat_producto dp on a.idproducto = dp.idproducto " .
            "                INNER JOIN mod_datosmaestros.nom_indicador i on dp.idindicador = i.idindicador " .
            "                INNER JOIN mod_datosmaestros.nom_naturaleza b on b.idnaturaleza = i.idnaturaleza " .
            "                INNER JOIN mod_logreserva.conf_cuadrobasico z on z.idindicador = i.idindicador " .
            "                INNER JOIN mod_logistica.dat_documento d1 on d1.iddocumento = a.iddocumento " .
            "                INNER JOIN mod_loginventario.dat_recepcion dr on dr.iddocumento = d1.iddocumento " .
            "                INNER JOIN mod_logreserva.dat_recepcionreserva da on da.iddocumento = d1.iddocumento " .
            "                INNER JOIN mod_logistica.dat_documentopadre ddp2 on ddp2.iddocumento = da.iddocumento " .
            "                INNER JOIN mod_logfacturacion.dat_docfactura df on df.idfactura = a.iddocumento " .
            "                INNER JOIN mod_logistica.dat_documento ddto on df.idfactura = ddto.iddocumento " .
            "                INNER JOIN mod_logistica.dat_documentopadre ddp on ddp.iddocumento = a.iddocumento " .
            "                INNER JOIN mod_logdistribucion.dat_distribucion dd on dd.iddistribucion = ddp.idpadre " .
            "                INNER JOIN mod_logistica.dat_documentopadre ddp1 on ddp1.iddocumento = dd.iddistribucion " .
            "                INNER JOIN mod_logistica.dat_documento d on d.iddocumento = ddp1.idpadre " .
            "                INNER JOIN mod_logreserva.dat_solicitudcambio dsc on dsc.idsolicitudcambio = d.iddocumento " .
            "                INNER JOIN mod_datosmaestros.dat_documentoprim p on d.iddoc = p.iddoc " .
            "                INNER JOIN mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = p.iddocumentos " .
            "                INNER JOIN mod_estructuracomp.dat_estructura r on r.idestructura = dp.idestructuracomun " .
            "                INNER JOIN mod_logistica.dat_documentocliente c on c.iddocumento = d.iddocumento " .
            "                INNER JOIN mod_logreserva.dat_clienteproducto dcp on dcp.iddocumentocliente = c.iddocumentocliente " .
            "                INNER JOIN mod_logreserva.dat_depositario t on dcp.idclienteproducto = t.idclienteproducto " .
            "                INNER JOIN mod_datosmaestros.nom_clientesproveedor m on m.idclientesproveedores = c.idcliente " .
            "                INNER JOIN mod_estructuracomp.dat_estructura r1 on r1.idestructura = m.idestructura " .
            "                AND d.idestructuracomun IN (" . $idestructuras .
            ") AND ndp.abreviatura = 'solicitudCS' AND da.concepto = 2  AND dsc.tipocambio = 1   " .
            "		WHERE d.estado IN(3,4,14,15) " .
            "                union "
            . "                SELECT count(distinct i.idindicador) as cantidad,  " .
            "                            '14' as iddoc, 'Entrada por pago del cambio de surtido (Temporal)' as sigla  " .
            "                From mod_logistica.dat_movimiento a " .
            "                INNER JOIN mod_logistica.dat_producto dp on a.idproducto = dp.idproducto " .
            "                INNER JOIN mod_datosmaestros.nom_indicador i on dp.idindicador = i.idindicador " .
            "                INNER JOIN mod_datosmaestros.nom_naturaleza b on b.idnaturaleza = i.idnaturaleza " .
            "                INNER JOIN mod_logreserva.conf_cuadrobasico z on z.idindicador = i.idindicador " .
            "                INNER JOIN mod_logistica.dat_documento d1 on d1.iddocumento = a.iddocumento " .
            "                INNER JOIN mod_loginventario.dat_recepcion dr on dr.iddocumento = d1.iddocumento " .
            "                INNER JOIN mod_logreserva.dat_recepcionreserva da on da.iddocumento = d1.iddocumento " .
            "                INNER JOIN mod_logistica.dat_documentopadre ddp2 on ddp2.iddocumento = da.iddocumento " .
            "                INNER JOIN mod_logfacturacion.dat_docfactura df on df.idfactura = a.iddocumento " .
            "                INNER JOIN mod_logistica.dat_documento ddto on df.idfactura = ddto.iddocumento " .
            "                INNER JOIN mod_logistica.dat_documentopadre ddp on ddp.iddocumento = a.iddocumento " .
            "                INNER JOIN mod_logdistribucion.dat_distribucion dd on dd.iddistribucion = ddp.idpadre " .
            "                INNER JOIN mod_logistica.dat_documentopadre ddp1 on ddp1.iddocumento = dd.iddistribucion " .
            "                INNER JOIN mod_logistica.dat_documento d on d.iddocumento = ddp1.idpadre " .
            "                INNER JOIN mod_logreserva.dat_solicitudcambio dsc on dsc.idsolicitudcambio = d.iddocumento " .
            "                INNER JOIN mod_datosmaestros.dat_documentoprim p on d.iddoc = p.iddoc " .
            "                INNER JOIN mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = p.iddocumentos " .
            "                INNER JOIN mod_estructuracomp.dat_estructura r on r.idestructura = dp.idestructuracomun " .
            "                INNER JOIN mod_logistica.dat_documentocliente c on c.iddocumento = d.iddocumento " .
            "                INNER JOIN mod_logreserva.dat_clienteproducto dcp on dcp.iddocumentocliente = c.iddocumentocliente " .
            "                INNER JOIN mod_logreserva.dat_depositario t on dcp.idclienteproducto = t.idclienteproducto " .
            "                INNER JOIN mod_datosmaestros.nom_clientesproveedor m on m.idclientesproveedores = c.idcliente " .
            "                INNER JOIN mod_estructuracomp.dat_estructura r1 on r1.idestructura = m.idestructura " .
            "                AND d.idestructuracomun IN (" . $idestructuras .
            ") AND da.concepto = 2 AND dsc.tipocambio = 1   " . "		WHERE d.estado IN(3,4,14,15) " .
            "                union " .
            "                SELECT count(distinct i.idindicador) as cantidad,  " .
            "                            '15' as iddoc, 'Entrada por acumulacion' as sigla  " .
            "                From mod_logistica.dat_movimiento a " .
            "                INNER JOIN mod_logistica.dat_producto dp on a.idproducto = dp.idproducto " .
            "                INNER JOIN mod_datosmaestros.nom_indicador i on dp.idindicador = i.idindicador " .
            "                INNER JOIN mod_datosmaestros.nom_naturaleza b on b.idnaturaleza = i.idnaturaleza " .
            "                INNER JOIN mod_logreserva.conf_cuadrobasico z on z.idindicador = i.idindicador " .
            "                INNER JOIN mod_logistica.dat_documento d on d.iddocumento = a.iddocumento " .
            "                INNER JOIN mod_loginventario.dat_recepcion dr on dr.iddocumento = d.iddocumento " .
            "                INNER JOIN mod_logreserva.dat_recepcionreserva da on da.iddocumento = d.iddocumento " .
            "                INNER JOIN mod_datosmaestros.dat_documentoprim p on d.iddoc = p.iddoc " .
            "                INNER JOIN mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = p.iddocumentos " .
            "                INNER JOIN mod_estructuracomp.dat_estructura r on r.idestructura = dp.idestructuracomun " .
            "                INNER JOIN mod_logistica.dat_documentocliente c on c.iddocumento = d.iddocumento " .
            "                INNER JOIN mod_datosmaestros.nom_clientesproveedor m on m.idclientesproveedores = c.idcliente " .
            "                INNER JOIN mod_estructuracomp.dat_estructura r1 on r1.idestructura = m.idestructura " .
            "                AND d.idestructuracomun IN (" . $idestructuras . ") AND da.concepto = 6 " .
            "		WHERE d.estado IN(3,4,14,15) " .
            "                union " .
            "                SELECT count(distinct i.idindicador) as cantidad,  " .
            "                            '16' as iddoc, 'Entrada por pago de faltante' as sigla  " .
            "                From mod_logistica.dat_movimiento a " .
            "                INNER JOIN mod_logistica.dat_producto dp on a.idproducto = dp.idproducto " .
            "                INNER JOIN mod_datosmaestros.nom_indicador i on dp.idindicador = i.idindicador " .
            "                INNER JOIN mod_datosmaestros.nom_naturaleza b on b.idnaturaleza = i.idnaturaleza " .
            "                INNER JOIN mod_logreserva.conf_cuadrobasico z on z.idindicador = i.idindicador " .
            "                INNER JOIN mod_logistica.dat_documento d1 on d1.iddocumento = a.iddocumento " .
            "                INNER JOIN mod_loginventario.dat_recepcion dr on dr.iddocumento = d1.iddocumento " .
            "                INNER JOIN mod_logreserva.dat_recepcionreserva da on da.iddocumento = d1.iddocumento " .
            "                INNER JOIN mod_logistica.dat_documentopadre ddp2 on ddp2.iddocumento = da.iddocumento " .
            "                INNER JOIN mod_logfacturacion.dat_docfactura df on df.idfactura = a.iddocumento " .
            "                INNER JOIN mod_logistica.dat_documento ddto on df.idfactura = ddto.iddocumento " .
            "                INNER JOIN mod_logistica.dat_documentopadre ddp on ddp.iddocumento = a.iddocumento " .
            "                INNER JOIN mod_logdistribucion.dat_distribucion dd on dd.iddistribucion = ddp.idpadre " .
            "                INNER JOIN mod_logistica.dat_documentopadre ddp1 on ddp1.iddocumento = dd.iddistribucion " .
            "                INNER JOIN mod_logistica.dat_documento d on d.iddocumento = ddp1.idpadre " .
            "                INNER JOIN mod_loginventario.dat_ajuste dai on dai.idajuste = d.iddocumento " .
            "                INNER JOIN mod_datosmaestros.nom_operacion no on no.idnomoperaciones = dai.idoperacion " .
            "                INNER JOIN mod_datosmaestros.dat_documentoprim p on d.iddoc = p.iddoc " .
            "                INNER JOIN mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = p.iddocumentos " .
            "                INNER JOIN mod_estructuracomp.dat_estructura r on r.idestructura = dp.idestructuracomun " .
            "                INNER JOIN mod_logistica.dat_documentocliente c on c.iddocumento = d.iddocumento " .
            "                INNER JOIN mod_logreserva.dat_clienteproducto dcp on dcp.iddocumentocliente = c.iddocumentocliente " .
            "                INNER JOIN mod_datosmaestros.nom_clientesproveedor m on m.idclientesproveedores = c.idcliente " .
            "                INNER JOIN mod_estructuracomp.dat_estructura r1 on r1.idestructura = m.idestructura " .
            "                AND d.idestructuracomun IN (" . $idestructuras .
            ") AND no.codigooperacion = 'OPER_INV_FALTANTE' " . "		WHERE d.estado IN(3,4,14,15) " .
            "                union " .
            "                SELECT count(distinct i.idindicador) as cantidad,  " .
            "                            '17' as iddoc, 'Entrada por cambio de ubicación Temporal' as sigla  " .
            "                From mod_logistica.dat_movimiento a " .
            "                INNER JOIN mod_logistica.dat_producto dp on a.idproducto = dp.idproducto " .
            "                INNER JOIN mod_datosmaestros.nom_indicador i on dp.idindicador = i.idindicador " .
            "                INNER JOIN mod_datosmaestros.nom_naturaleza b on b.idnaturaleza = i.idnaturaleza " .
            "                INNER JOIN mod_logreserva.conf_cuadrobasico z on z.idindicador = i.idindicador " .
            "                INNER JOIN mod_logistica.dat_documento d1 on d1.iddocumento = a.iddocumento " .
            "                INNER JOIN mod_loginventario.dat_recepcion dr on dr.iddocumento = d1.iddocumento " .
            "                INNER JOIN mod_logreserva.dat_recepcionreserva da on da.iddocumento = d1.iddocumento " .
            "                INNER JOIN mod_logistica.dat_documentopadre ddp2 on ddp2.iddocumento = da.iddocumento " .
            "                INNER JOIN mod_logfacturacion.dat_docfactura df on df.idfactura = a.iddocumento " .
            "                INNER JOIN mod_logistica.dat_documento ddto on df.idfactura = ddto.iddocumento " .
            "                INNER JOIN mod_logistica.dat_documentopadre ddp on ddp.iddocumento = a.iddocumento " .
            "                INNER JOIN mod_logdistribucion.dat_distribucion dd on dd.iddistribucion = ddp.idpadre " .
            "                INNER JOIN mod_logistica.dat_documentopadre ddp1 on ddp1.iddocumento = dd.iddistribucion " .
            "                INNER JOIN mod_logistica.dat_documento d on d.iddocumento = ddp1.idpadre " .
            "                INNER JOIN mod_logreserva.dat_solicitudcambio dsc on dsc.idsolicitudcambio = d.iddocumento " .
            "                INNER JOIN mod_datosmaestros.dat_documentoprim p on d.iddoc = p.iddoc " .
            "                INNER JOIN mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = p.iddocumentos " .
            "                INNER JOIN mod_estructuracomp.dat_estructura r on r.idestructura = dp.idestructuracomun " .
            "                INNER JOIN mod_logistica.dat_documentocliente c on c.iddocumento = d.iddocumento " .
            "                INNER JOIN mod_logreserva.dat_clienteproducto dcp on dcp.iddocumentocliente = c.iddocumentocliente " .
            "                INNER JOIN mod_logreserva.dat_depositario t on dcp.idclienteproducto = t.idclienteproducto " .
            "                INNER JOIN mod_datosmaestros.nom_clientesproveedor m on m.idclientesproveedores = c.idcliente " .
            "                INNER JOIN mod_estructuracomp.dat_estructura r1 on r1.idestructura = m.idestructura " .
            "                AND d.idestructuracomun IN (" . $idestructuras .
            ") AND da.concepto = 3 AND dsc.tipocambio = 1   " . "		WHERE d.estado IN(3,4,14,15) " .
            "                union " .
            "                SELECT count(distinct i.idindicador) as cantidad,  " .
            "                            '18' as iddoc, 'Entrada por pago de comercialización' as sigla  " .
            "                From mod_logistica.dat_movimiento a " .
            "                INNER JOIN mod_logistica.dat_producto dp on a.idproducto = dp.idproducto " .
            "                INNER JOIN mod_datosmaestros.nom_indicador i on dp.idindicador = i.idindicador " .
            "                INNER JOIN mod_datosmaestros.nom_naturaleza b on b.idnaturaleza = i.idnaturaleza " .
            "                INNER JOIN mod_logreserva.conf_cuadrobasico z on z.idindicador = i.idindicador " .
            "                INNER JOIN mod_logistica.dat_documento d1 on d1.iddocumento = a.iddocumento " .
            "                INNER JOIN mod_loginventario.dat_recepcion dr on dr.iddocumento = d1.iddocumento " .
            "                INNER JOIN mod_logreserva.dat_recepcionreserva da on da.iddocumento = a.iddocumento " .
            "                INNER JOIN mod_logistica.dat_documentopadre ddp2 on ddp2.iddocumento = da.iddocumento " .
            "                INNER JOIN mod_logfacturacion.dat_docfactura df on df.idfactura = a.iddocumento " .
            "                INNER JOIN mod_logistica.dat_documento ddto on df.idfactura = ddto.iddocumento " .
            "                INNER JOIN mod_logistica.dat_documentopadre ddp on ddp.iddocumento = a.iddocumento " .
            "                INNER JOIN mod_logdistribucion.dat_distribucion dd on dd.iddistribucion = ddp.idpadre " .
            "                INNER JOIN mod_logistica.dat_documentopadre ddp1 on ddp1.iddocumento = dd.iddistribucion " .
            "                INNER JOIN mod_logistica.dat_documento d on d.iddocumento = ddp1.idpadre " .
            "                INNER JOIN mod_logreserva.dat_solicitudcambio dsc on dsc.idsolicitudcambio = d.iddocumento " .
            "                INNER JOIN mod_datosmaestros.dat_documentoprim p on d.iddoc = p.iddoc " .
            "                INNER JOIN mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = p.iddocumentos " .
            "                INNER JOIN mod_estructuracomp.dat_estructura r on r.idestructura = dp.idestructuracomun " .
            "                INNER JOIN mod_logistica.dat_documentocliente c on c.iddocumento = d.iddocumento " .
            "                INNER JOIN mod_logreserva.dat_clienteproducto dcp on dcp.iddocumentocliente = c.iddocumentocliente " .
            "                INNER JOIN mod_logreserva.dat_depositario t on dcp.idclienteproducto = t.idclienteproducto " .
            "                INNER JOIN mod_datosmaestros.nom_clientesproveedor m on m.idclientesproveedores = c.idcliente " .
            "                INNER JOIN mod_estructuracomp.dat_estructura r1 on r1.idestructura = m.idestructura " .
            "                AND d.idestructuracomun IN (" . $idestructuras .
            ") AND da.concepto = 8 AND dsc.tipocambio = 1 " . "		WHERE d.estado IN(3,4,14,15) " .
            "                ) q";

        return array('sqlmovreserva' => "\"" . $sql . "\"");
    }

}
