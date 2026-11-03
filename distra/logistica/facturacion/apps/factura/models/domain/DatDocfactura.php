<?php

/**
 * Clase mapeada de la tabla de base de datos
 *
 * @package    Facturacion
 * @author     Division de Gestion de Entidades
 * @copyright  XETID
 * @version    5.0
 */
class DatDocfactura extends BaseDatDocfactura
{

    private $logisticaDoctrine;

    public function Setup()
    {
        parent::Setup();
        $this->logisticaDoctrine = LogisticaDoctrineHelper::__init();
        $this->hasOne(
            'DatDocumento', array('local' => 'idfactura', 'foreign' => 'iddocumento')
        );
        $this->hasMany(
            'DatProdFactura', array('local' => 'idfactura', 'foreign' => 'idfactura')
        );
        $this->hasMany(
            'DatServFactura', array('local' => 'idfactura', 'foreign' => 'idfactura')
        );
        $this->hasOne(
            'DatDocFacturaTransportacion', array('local' => 'idfactura', 'foreign' => 'idfactura')
        );
        $this->hasOne(
            'DatFacturacontrato', array('local' => 'idfactura', 'foreign' => 'idfactura')
        );
        $this->hasMany(
            'DatAreaFactura', array('local' => 'idfactura', 'foreign' => 'idfactura')
        );
        $this->hasOne(
            'DatFacturaPrefactura', array('local' => 'idfactura', 'foreign' => 'idfactura')
        );
        $this->hasOne('DatNumerocontrol', array('local' => 'idnumerocontrol', 'foreign' => 'idnumerocontrol'));
        $this->hasOne(
            'DatSerieDocumentoEntidad', array('local' => 'idseriedocentidad', 'foreign' => 'idseriedocentidad')
        );
        $this->hasMany(
            'DatCuentafactura', array('local' => 'idfactura', 'foreign' => 'idfactura')
        );
        $this->hasMany(
            'DatCuentafacturacliente', array('local' => 'idfactura', 'foreign' => 'idfactura')
        );
        if(class_exists('DatVentafactura')){
            $this->hasOne('DatVentafactura', array('local' => 'idfactura', 'foreign' => 'idfactura'));
        }
        $array[] = array('cardinalidad' => 'one', 'relation' => 'DatDocfactura',
            'properties' => array('local' => 'iddocumento', 'foreign' => 'idfactura'));
        $this->logisticaDoctrine->tryInyectRelactions(
            new DatDocumento(), $array
        );
    }

    public function innerJoinWithFactura(Doctrine_Query $query, $alias = 'd', $aliasLocal = 'df', $join = 1, $numeroferta)
    {
        //$numeroref = "COALESCE(df.nroreal,CAST({$alias}.nrodoc AS VARCHAR))";
        if($numeroferta){
            $numeroref = " COALESCE(df.nroreal,CAST({$alias}.nrodoc AS VARCHAR))";
        }else{
            $numeroref = " CAST({$alias}.nrodoc AS VARCHAR)";
        }
        if($join) {
          $query->innerJoin("{$alias}.DatDocfactura {$aliasLocal}");
        } else {
          $query->leftJoin("{$alias}.DatDocfactura {$aliasLocal}");
        }
        $query->leftJoin("{$aliasLocal}.DatSerieDocumentoEntidad dse")
            ->leftJoin("dse.NomSerieDocumento nsd")
            ->addSelect(
                "{$aliasLocal}.iddeposito as iddeposito,
                   {$aliasLocal}.idproveedor as idproveedor,
                   (CASE WHEN {$aliasLocal}.oferta > 0 THEN
                      (
                          CASE WHEN (SELECT SUM(dc.pendiente) FROM DatPrefacturacmpto dc
                          LEFT JOIN dc.DatMovimientos dm
                          LEFT JOIN dc.DatElementosFactura de
                          WHERE dm.iddocumento = {$aliasLocal}.idfactura OR de.idfactura = {$aliasLocal}.idfactura
                      ) is null THEN (
                              CASE WHEN (SELECT COUNT(ddp1.idpadre) FROM DatDocumentoPadre ddp1
                              WHERE ddp1.idpadre = {$aliasLocal}.idfactura
                          ) > 0 THEN 2 ELSE 1 END
                      ) WHEN (SELECT SUM(dc1.pendiente) FROM DatPrefacturacmpto dc1
                          LEFT JOIN dc1.DatMovimientos dm1
                          LEFT JOIN dc1.DatElementosFactura de1
                          WHERE dm1.iddocumento = {$aliasLocal}.idfactura OR de1.idfactura = {$aliasLocal}.idfactura
                      ) = 0 THEN 2 ELSE 1 END)
                    ELSE 0 END) as oferta,
                   {$aliasLocal}.esnota as esnota,
                   {$aliasLocal}.idcliente as idcliente,
                   {$aliasLocal}.alquiler as alquiler,
                   {$aliasLocal}.idcontacto as idcontacto,
                   {$aliasLocal}.idvendedor as idvendedor,
                   {$aliasLocal}.idcondicionpago as idcondicionpago,
                   {$aliasLocal}.idsubsistema as idsubsistema,
                   {$aliasLocal}.idseriedocentidad as idseriedocentidad,
                   nsd.denominacion as denomserie,
                   {$aliasLocal}.fechavencimiento as fechavencimiento,
                   {$aliasLocal}.dias as dias,
                   {$aliasLocal}.idnumerocontrol as idnumerocontrol,
                   ARRAY(SELECT idcuentasuministrador FROM dat_cuentafactura WHERE idfactura = {$aliasLocal}.idfactura) as idcuentabancaria,
                   ARRAY(SELECT COALESCE(idcuentacliente,-1) FROM dat_cuentafacturacliente WHERE idfactura = {$aliasLocal}.idfactura) as idcuentabancliente,
                   ARRAY(SELECT COALESCE(numerocuenta,'SC') FROM dat_cuentafacturacliente WHERE idfactura = {$aliasLocal}.idfactura) as numerocuenta,
                   (CASE WHEN df.idfactura IS NULL THEN ''||{$alias}.nrodoc ELSE (CASE WHEN {$aliasLocal}.oferta > 0 THEN ''||{$numeroref} WHEN {$aliasLocal}.idseriedocentidad IS NULL OR {$aliasLocal}.idseriedocentidad = -1 then
                   ''||{$aliasLocal}.nrofactura ELSE nsd.denominacion||'-'||{$aliasLocal}.nrofactura END) END) as nrodocumento,
                   (CASE WHEN df.idfactura IS NULL THEN ''||{$alias}.nrodoc ELSE (CASE WHEN {$aliasLocal}.oferta > 0 THEN ''||{$numeroref}
                   WHEN {$aliasLocal}.idseriedocentidad IS NULL OR {$aliasLocal}.idseriedocentidad = -1 then
                   ''||{$aliasLocal}.nrofactura ELSE nsd.denominacion||'-'||{$aliasLocal}.nrofactura END) END) as nrodoc,
                   (CASE WHEN df.idfactura IS NULL THEN d.nrodoc ELSE {$aliasLocal}.nrofactura END) as numdocumento,
                   {$aliasLocal}.idmoneda as idmoneda,
                 {$aliasLocal}.tasacambio as tasacambio,
                 {$aliasLocal}.factorconvercion as factorconvercion,
                 {$aliasLocal}.nrorden as nrorden,
                 {$aliasLocal}.pagoexterior as pagoexterior,
                 {$aliasLocal}.idcentrocosto as idcentrocosto,
                 {$aliasLocal}.idclienteauxiliar as idclienteauxiliar,
                 {$aliasLocal}.idnomformapago as idnomformapago,
                 {$aliasLocal}.idmonedaprod as idmonedaprod,
                 {$aliasLocal}.idmonedaserv as idmonedaserv,
                 {$aliasLocal}.idtipotasa as idtipotasa,
                 {$aliasLocal}.nombrecontacto as nombrecontacto,
                 {$aliasLocal}.cicontacto as cicontacto,
                 {$aliasLocal}.telfcontacto as telfcontacto,
                 {$aliasLocal}.tipoconceptoventa as tipoconceptoventa,
                 {$aliasLocal}.valorconcepto as valorconcepto,
                 {$aliasLocal}.calculoconcepto as calculoconcepto,
                 {$aliasLocal}.conceptoventa as conceptoventa"
            );
        if (class_exists('DatVentafactura')) {
            $query->leftJoin("{$aliasLocal}.DatVentafactura dvf")
                  ->leftJoin('dvf.DatVenta dv');
            $query->addSelect("dv.nroventa as docorigen");
        }
        return $query;
    }

    public function addFiltersFactura(Doctrine_Query $dql, $parametros, $aliasD = 'd')
    {
        if ($parametros['idpadre']) {
            $dql->innerJoin("{$aliasD}.DatDocumentoPadre ddp");
            $dql->andWhereIn(
                "ddp.idpadre ", explode(',', $parametros['idpadre'])
            );
        }
        if ($parametros['solonotas'] && $parametros['iddeposito']) {
            $dql->addWhere('df.esnota = ?', 1);
            $dql->addWhere(
                "df.iddeposito = ? or df.iddeposito is null", array($parametros['iddeposito'])
            );
        } else {
            if ($parametros['iddeposito']) {
                $dql->addWhere(
                    "df.iddeposito = ?", array($parametros['iddeposito'])
                );
            } else {
                if ($parametros['solonotas']) {
                    $dql->addWhere('df.esnota = ?', 1);
                }
            }
        }
        if ($parametros['solofacturas']) {
            //$dql->addWhere('df.esnota = ? and df.oferta = ?', array(0, 0));
        }
        if ($parametros['sinnotascd']) {
            //$dql->addWhere('df.esnota = ? and df.oferta = ?', array(0, 0));
            $dql->addWhere("{$aliasD}.iddoc = ?", array($parametros['iddocfact']));
        }
        if ($parametros['notadc']){
            $dql->andWhereIn("{$aliasD}.iddoc", $parametros['iddocnotadc']);
        }
        if ($parametros['ofertas']) {
            $dql->addWhere('df.oferta <> ?', array(0));
        }
        if ($parametros['iddocumento']) {
            $dql->addWhere(
                "{$aliasD}.iddocumento = ?", array($parametros['iddocumento'])
            );
        }
        if ($parametros['idsubsistema']) {
            $dql->addWhere("df.idsubsistema = ?", $parametros['idsubsistema']);
        }
        /*if ($parametros['estado']) {
            if (!is_array($parametros['estado'])) {
                $dql->addWhere("{$aliasD}.estado = ?", $parametros['estado']);
            } else {
                $dql->andWhereIn("{$aliasD}.estado", $parametros['estado']);
            }
        }*/
        if ($parametros['criterio']) {
            if (is_numeric($parametros['criterio'])) {
                $parametros['nrodoc'] = $parametros['criterio'];
                $parametros['nroreal'] = $parametros['criterio'];
                $parametros['cicontacto'] = $parametros['criterio'];
                $parametros['telfcontacto'] = $parametros['criterio'];
            } else {
                $parametros['nroreal'] = $parametros['criterio'];
                $parametros['contacto'] = $parametros['criterio'];
            }
            $parametros['observacion'] = $parametros['criterio'];
            unset($parametros['criterio']);
        }
        if ($parametros['nrodoc']) {
            if($parametros['observacion']){
                $dql->addWhere("(
                df.cicontacto ilike '%{$parametros['cicontacto']}%' OR df.telfcontacto ilike '%{$parametros['telfcontacto']}%' OR 
                df.nrofactura = ? OR {$aliasD}.numeroref = ? OR {$aliasD}.nrodoc = ? OR df.nroreal ilike '%{$parametros['nroreal']}%' OR {$aliasD}.observaciones ilike '%{$parametros['observacion']}%')",
                    array($parametros['nrodoc'], $parametros['nrodoc'], $parametros['nrodoc']));
            } else {
                $dql->addWhere("(
                df.cicontacto ilike '%{$parametros['cicontacto']}%' OR df.telfcontacto ilike '%{$parametros['telfcontacto']}%' OR 
                df.nrofactura = ? OR {$aliasD}.numeroref = ? OR {$aliasD}.nrodoc = ? OR df.nroreal ilike '%{$parametros['nroreal']}%')",
                    array($parametros['nrodoc'], $parametros['nrodoc'], $parametros['nrodoc']));
            }
        } else if ($parametros['observacion']) {
            if (isset($parametros['contacto'])) {
                $dql->addWhere("(df.nombrecontacto ilike '%{$parametros['contacto']}%' OR 
                                df.telfcontacto ilike '%{$parametros['telfcontacto']}%' OR 
                                {$aliasD}.observaciones ilike '%{$parametros['observacion']}%')");
            } else {
                $dql->addWhere("{$aliasD}.observaciones ilike '%{$parametros['observacion']}%'");
            }
        }
        if ($parametros['idcentrocosto']) {
            $dql->addWhere("df.idcentrocosto = ?", $parametros['idcentrocosto']);
        }
        /*if ($parametros['nroreal']) {
            $dql->orWhere("(df.nroreal ilike '%{$parametros['nroreal']}%')");
        }*/
    }

    public function eliminarProductos($iddocumentos)
    {
        /* $query = new Doctrine_Query();
          return $query->delete()
          ->from('DatMovimientos dm')
          ->whereIn('dm.iddocumento', $iddocumentos)
          ->execute(); */
    }

    public function eliminarFacturas($iddocumentos)
    {
        return Doctrine_Query::create()
            ->delete()
            ->from('DatDocfactura')
            ->whereIn('idfactura', $iddocumentos)
            ->execute();
    }

    public function getNroFacturaPrefactura($oferta, $iddoc)
    {
        $nrofactura = Doctrine_Query::create()
            ->select("MAX(d.nrodoc)")
            ->from('DatDocfactura f')
            ->innerJoin('f.DatDocumento d')
            ->where('d.iddoc = ?', array($iddoc));
        if ($oferta == 0) {
            $nrofactura->addWhere("f.oferta = 0");
        } else {
            $nrofactura->addWhere("f.oferta in (1,2)");
        }
        $nrofactura = $nrofactura->fetchArray();
        $nroMax = $nrofactura[0]['MAX'];
        return $nroMax + 1;
    }

    public function getDatosExistencias($documentos)
    {
        //revisar el tema de cuando sea a partir de una nota(la nota ya rebajo existencia)
        $serviceEstructura = new UtilesubicacionService();
        $array[] = array('cardinalidad' => 'many', 'relation' => 'DatMovubicacion',
            'properties' => array('local' => 'idmovimiento', 'foreign' => 'idmovimiento'));
        UtilesDoctrineModel::tryInyectRelactions(new DatMovimientos(), $array);
        $query = new Doctrine_Query();
        $datos = $query->select(
            'ubp.idmovimiento,
             dm.idproducto as idproducto,
             ubp.idestructuraubicacion as idubicacion,
             sum(ubp.cantidad) as suma'
        )
            ->from('DatMovubicacion ubp')
            ->innerJoin('ubp.DatMovimientos dm')
            ->whereIn('dm.iddocumento', $documentos)
            ->groupby(
                'dm.idproducto,
			  ubp.idestructuraubicacion,
			  ubp.idmovubicacion'
            )
            ->fetchArray();
        foreach ($datos as &$dato) {
            $servicio = $serviceEstructura->sumarCantidades($dato);
            $dato['cantidad'] = $servicio[0]['cantidad'];
        }
        return $datos;
    }

    public function getIdsFacturas($params)
    {
        $conn = Zend_Registry::get('conexion');
        $sql = "select idfactura from mod_logfacturacion.dat_docfactura ";
        if ($params['idsubsistema'] && $params['idestructuracomun']) {
            $sql .= "where idsubsistema = {$params['idsubsistema']} and idestructuracomun = {$params['idestructuracomun']} ";
        }
        return $conn->execute($sql)
            ->fetchAll(PDO::FETCH_COLUMN);
    }

    public function getFacturasCliente($parametros, $dql = false)
    {
        $query = Doctrine_Query::create()
            ->select(
                'df.idfactura, dd.iddocumento as iddocumento, df.nrofactura as nrodoc,
                dd.fechacontable as fechacontable, ddc.idcliente as idcliente, ddc.tipocliente as tipocliente,
                (SELECT COUNT(idmovimiento) FROM DatMovimientos WHERE iddocumento = df.idfactura) as cantproductos'
            )
            ->from('DatDocfactura df')
            ->innerJoin('df.DatDocumento dd')
            ->innerJoin('dd.DatDocumentoCliente ddc')
            ->addWhere(
                'df.idsubsistema = ?', array(LogisticaGlobal::SUBSISTEMA_INV)
            );
        if ($parametros['idcliente']) {
            $query->andWhereIn('df.idcliente', $parametros['idcliente']);
        }
        
		    if ($parametros['iddoc']) {
            $query->addWhere('dd.iddoc = ?', array($parametros['iddoc']));
        }
        if ($parametros['idestructura']) {
            $query->addWhere('df.iddeposito = ?', array($parametros['idestructura']));
        }
        if ($parametros['estado']) {
            $query->addWhere('dd.estado = ?', array($parametros['estado']));
        }
        if ($parametros['conduce']) {
            $query->addWhere('df.esnota <> 0');
        } else {
            $query->addWhere('df.esnota = 0');
        }
        if ($parametros['iddocumento']) {
            $query->andWhereNotIn('dd.iddocumento', $parametros['iddocumento']);
        }
        if ($parametros['criterio']) {
            $query->addWhere('df.nrofactura = ?', array($parametros['criterio']));
        }
        if ($dql) {
            return $query;
        }
        
        $total = $query->count();
        if ($parametros['start']) {
            $query->offset($parametros['start']);
        }
        if ($parametros['limit']) {
            $query->limit($parametros['limit']);
        }
        return array('datos' => $query->fetchArray(), 'cantidad' => $total);
    }

    public function getNumerosAnuladosFacturas($idestructura)
    {
        $conn = Zend_Registry::get('conexion');
        $sql = "select df.nrofactura, df.nrocontrol from mod_logfacturacion.dat_docfactura df
                inner join mod_logistica.dat_documento dd on dd.iddocumento = df.idfactura
                where dd.idestructuracomun = {$idestructura} and df.nrofactura is not null
                UNION
                select a.nrofactura, a.nrocontrol from mod_logfacturacion.dat_nrocontrolanulados a
                where a.idestructura={$idestructura}";
        return $conn->execute($sql)
            ->fetchAll(PDO::FETCH_ASSOC);
        /* $query = Doctrine_Query::create()
          ->select(
          'df.nrofactura, df.nrocontrol as nrocontrol'
          )
          ->from('DatDocfactura df')
          ->innerJoin('df.DatDocumento dd')
          ->where(
          'dd.idestructuracomun = ? and df.nrofactura is not null', array($idestructura)
          );
          return $query->fetchArray(); */
    }

    public function getNrocontrolAsignados($rango, $iddoc)
    {
        $conn = Doctrine_Manager::connection();
        $query = "SELECT DISTINCT cast(replace(m.nrocontrol, '-', '') as int) AS m
                FROM mod_logfacturacion.dat_docfactura m
                inner join mod_logistica.dat_documento d on d.iddocumento = m.idfactura
                WHERE (m.nrocontrol is not null) and (cast(replace(m.nrocontrol, '-', '') as int) >= :nroinicio
                and cast(replace(m.nrocontrol, '-', '') as int) <= :nrofin) and m.nrocontrol <> ''
                and d.iddoc in (" . implode(',', $iddoc) . ") and d.estado <> 8
                order by m asc";
        $result = $conn->execute($query, $rango)
            ->fetchAll(PDO::FETCH_COLUMN);
        return array("total" => count($result), "asignados" => $result);
    }

    public function getNroFactura($idestructura)
    {
        $nrofactura = Doctrine_Query::create()
            ->select("MAX(f.nrofactura)")
            ->from('DatDocfactura f')
            ->innerJoin('f.DatDocumento d')
            ->where('d.idestructuracomun = ?', array($idestructura))//and f.manual = 0
            ->fetchArray();
        $nrofacturaAnulado = Doctrine_Query::create()
            ->select("MAX(a.nrofactura)")
            ->from('DatNrocontrolanulados a')//aqui tengo q excluir los q sean manuales
            ->where('a.idestructura = ?', array($idestructura))
            ->fetchArray();
        $nroMax = ($nrofactura[0]['MAX'] > $nrofacturaAnulado[0]['MAX']) ? $nrofactura[0]['MAX']
            : $nrofacturaAnulado[0]['MAX'];
        return $nroMax + 1;
    }

    public function getNumerosControlEnF($parametros)
    {
        return $query = Doctrine_Query::create()
            ->select('df.nrocontrol')
            ->from('DatDocfactura df')
            ->innerJoin('df.DatDocumento dd')
            ->where('nrocontrol is not null and dd.idestructuracomun = ?', array($parametros['idestructura']))
            ->fetchArray();
    }

    public function updateOfertasNotas($documentos)
    {
        $conn = Doctrine_Manager::connection();
        $query = "update mod_logfacturacion.dat_docfactura set oferta = 1 where idfactura
                  in (" . implode(',', $documentos) . ")
                  and oferta = 2";
        $query2 = "update mod_logfacturacion.dat_docfactura set esnota = 1 where idfactura
                  in (" . implode(',', $documentos) . ")
                  and esnota = 2";
        $conn->execute($query);
        $conn->execute($query2);
        return true;
    }

    public function actualizarNrosControlAnulados($idfacturas)
    {
        $arrayId = implode(',', $idfacturas);
        $sql =
            "update mod_logfacturacion.dat_docfactura set idnumerocontrol = NULL WHERE (idfactura in ({$arrayId}))";
        $conn = Zend_Registry::get('conexion');
        $conn->exec($sql);
    }

    public function estaEnUsoSerie($idseriedocentidad)
    {
        $respuesta = $query = Doctrine_Query::create()
            ->select('idfactura')
            ->from('DatDocfactura')
            ->whereIn('idseriedocentidad', $idseriedocentidad)
            ->limit(1)
            ->fetchArray();
        return (count($respuesta) > 0) ? 1 : 0;
    }

    public function getNumeroFactura($iddocumento){
        $query = new Doctrine_Query();
        if(is_array($iddocumento)){
           $datos = $query->select("(CASE WHEN df.idseriedocentidad IS NULL OR df.idseriedocentidad = -1 then ".
                   "''||df.nrofactura ELSE nsd.denominacion||' - '||df.nrofactura END) as nrodoc")
                          ->from('DatDocfactura df')
                          ->leftJoin("df.DatSerieDocumentoEntidad dse")
                          ->leftJoin("dse.NomSerieDocumento nsd")
                          ->whereIn('df.idfactura', $iddocumento)->fetchArray();
          return $datos;
        }else{
           $datos = $query->select("(CASE WHEN df.idseriedocentidad IS NULL OR df.idseriedocentidad = -1 then ".
                   "''||df.nrofactura ELSE nsd.denominacion||' - '||df.nrofactura END) as nrodoc")
                          ->from('DatDocfactura df')
                          ->leftJoin("df.DatSerieDocumentoEntidad dse")
                          ->leftJoin("dse.NomSerieDocumento nsd")
                          ->where('df.idfactura = ?', array($iddocumento))->fetchArray();
          return $datos[0]['nrodoc'];
        }
    }
}
