<?php

class DatEstructuraubicacion extends BaseDatEstructuraubicacion
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne('DatArea', array('local' => 'idarea', 'foreign' => 'idarea'));
        $this->hasOne('NomTipoubicacion', array('local' => 'idtipoubicacion', 'foreign' => 'idtipoubicacion'));
        $this->hasOne(
            'DatValorescampostipoubicacion',
            array('local' => 'idestructuraubicacion', 'foreign' => 'idestructuraubicacion')
        );
        $this->hasOne('DatEstructuraubicacion', array('local' => 'idpadre', 'foreign' => 'idpadre'));
        $this->hasMany(
            'DatExistenciaubicacion', array('local' => 'idestructuraubicacion', 'foreign' => 'idestructuraubicacion')
        );
        $this->hasOne(
            'DatMovubicacion', array('local' => 'idestructuraubicacion', 'foreign' => 'idestructuraubicacion')
        );
        $this->hasOne(
            'DatProdtranfintubicacion', array('local' => 'idestructuraubicacion', 'foreign' => 'idestructuraubicacion')
        );
        $this->hasMany('DatUbicacionproducto', array('local' => 'idestructuraubicacion', 'foreign' => 'idubicacion'));
        $this->hasMany('DatUbicacionlote', array('local' => 'idestructuraubicacion', 'foreign' => 'idubicacion'));
        $this->hasMany('DatArealote', array('local' => 'idarea', 'foreign' => 'idarea'));
    }

    /**
     * Devuelve el idarea a la que pertenece una estructura ubicacion.
     * @param numeric $idestructuraubicacion
     * @return numeric
     */
    public function getIdAreaXIdEstructura($idestructuraubicacion)
    {
        $datEstruc = Doctrine::getTable('DatEstructuraubicacion')->find($idestructuraubicacion);
        return $datEstruc->idarea;
    }

    /**
     * Devuelve los hijos de la ubicacion.
     * @param numeric $idestructuraubicacion
     * @param boolean $dql [Opcional]
     * @return array|Doctrine_Query
     */
    public function getHijos($idestructuraubicacion, $dql = false)
    {
        $query = Doctrine_Query::create()
            ->from('DatEstructuraubicacion eu')
            ->where('eu.idpadre = ? AND eu.idpadre <> eu.idestructuraubicacion', $idestructuraubicacion);
        if ($dql) {
            return $query;
        }
        return $query->fetchArray();
    }

    /**
     *
     * @autor Javier Gonzalez Rodriguez
     * @param int $idtipotransferencia
     * @param int $iddeposito
     * Cargar las areas por tipo de transferencia entre area
     * nomencladas pos deposito
     */
    public function cargarAreasXTipotransferencia($idtipotransferencia, $iddeposito)
    {
        $conn = Doctrine_Manager:: connection();
        $sql = "SELECT deu.descripcion, deu.idarea, dai.idnomtipoarea
                FROM mod_logubicacion.dat_estructuraubicacion as deu 
                INNER JOIN mod_logubicacion.dat_area as da ON deu.idarea = da.idarea 
                INNER JOIN mod_logubicacion.dat_areainventario dai ON dai.idarea = da.idarea 
                INNER JOIN mod_logubicacion.nom_tipoarea as nta ON nta.idnomtipoarea = dai.idnomtipoarea 
                INNER JOIN mod_logistica.nom_tipotransferenciaarea as ntta ON ntta.idnomtipoarea = nta.idnomtipoarea 
                INNER JOIN mod_logistica.nom_tipotransferencia ntf 
                ON ntta.idtipotransferencia = ntf.idtipotransferencia 
                WHERE ntf.idtipotransferencia = {$idtipotransferencia} 
                AND da.idestructuracomun = {$iddeposito}  
                AND deu.nivel = 1";
        $resp = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $resp;
    }

    /**
     * Devuelve las areas de un deposito.
     * @param numeric $iddeposito
     * @param boolean $dql [Opcional]
     * @return array|Doctrine_Query
     */
    public function getAreasPorDeposito($iddeposito, $dql = false)
    {
        $query = Doctrine_Query::create()
            ->select('a.idarea, eu.descripcion AS descripcion, eu.idestructuraubicacion AS idestructuraubicacion')
            ->from('DatArea a')
            ->innerJoin('a.DatEstructuraubicacion eu')
            ->where('a.idestructuracomun = ? AND eu.idestructuraubicacion = eu.idpadre', $iddeposito);
        if ($dql) {
            return $query;
        }
        return $query->fetchArray();
    }

    /**
     * Devuelce las ubicaciones de un area.
     * @param array $filtro
     * @param boolean $dql [Opcional]
     * @return array|Doctrine_Query
     */
    public function getUbicacionesPorArea($filtro, $dql = false)
    {
        $query = Doctrine_Query::create()
            ->select('eu.idarea, eu.idestructuraubicacion AS idubicacion, eu.descripcion AS ubicacion')
            ->from('DatEstructuraubicacion eu')
            ->where('eu.idarea = ?', $filtro['idarea']);
        if ($dql) {
            return $query;
        }
        return array(
            'cantidad' => $query->count(),
            'datos' => LogisticaDoctrineHelper::__init()->addQueryLimits($query, $filtro)->fetchArray()
        );
    }

    public function obtenerEstructura($idestructuraubicacion, $dql = false)
    {
        $query = Doctrine_Query::create()
            ->select(
                'a.idarea, a.idestructuracomun, a.idformato, eu.idestructuraubicacion AS idestructuraubicacion, '
                . 'eu.idpadre AS idpadre, eu.codigo AS codigo, eu.descripcion AS descripcion, '
                . 'eu.idtipoubicacion AS idtipoubicacion, ai.idnomtipoarea AS idnomtipoarea, '
                . 'ai.ubicacionarea AS ubicacionarea, vc.capacidad AS capacidad, vc.idproducto AS idproducto, '
                . 'vc.idunidadmedida AS idunidadmedida, vc.ancho AS ancho, vc.alto AS alto, vc.largo AS largo, '
                . 'vc.peso AS peso, ind.denominacion AS denomproducto'
            )
            ->from('DatArea a')
            ->innerJoin('a.DatEstructuraubicacion eu')
            ->leftJoin('eu.DatValorescampostipoubicacion vc')
            ->leftJoin('a.DatAreainventario ai')
            ->leftJoin('eu.NomTipoubicacion ntu')
            ->leftJoin('vc.NomIndicador ind')
            ->where('eu.idestructuraubicacion = ?', $idestructuraubicacion);
        if ($dql) {
            return $query;
        }
        return $query->fetchArray();
    }

    public function cargarUbcEstructuraProducto($ordizq, $idarbol = 0)
    {
        $query = Doctrine_Query::create()
            ->select("(dest.codigo ||  ':' ||dest.descripcion) AS descripcion")
            ->from('DatEstructuraubicacion dest')
            ->where("dest.ordenizq <= {$ordizq} AND {$ordizq} < dest.ordender")
            ->orderby('dest.nivel');
        if ($idarbol != 0) {
            $query->addWhere('dest.idarbol = ?', $idarbol);
        }
        return $query->fetchArray();
    }

    public function devolverNivel($idestructura)
    {
        $query = Doctrine_Query::create()
            ->select('eu.nivel')
            ->from('DatEstructuraubicacion eu')
            ->where('eu.idestructuraubicacion = ?', $idestructura);
        return $query->fetchArray();
    }

    public function dameAreaByEstructura($idarea)
    {
        $query = Doctrine_Query::create()
            ->select('eu.descripcion')
            ->from('DatEstructuraubicacion eu')
            ->where('eu.idarea = ? AND eu.idestructuraubicacion = eu.idpadre', $idarea);
        return $query->fetchArray();
    }

    public function dameUbicacionesPorDeposito($iddeposito)
    {
        $query = Doctrine_Query::create()
            ->select(
                'a.idarea, eu.descripcion AS descripcion, eu.nivel AS nivel, eu.idpadre AS idpadre, '
                . 'eu.idestructuraubicacion AS idestructuraubicacion'
            )
            ->from('DatArea a')
            ->innerJoin('a.DatEstructuraubicacion eu')
            ->where('a.idestructuracomun = ?', $iddeposito);
        return $query->fetchArray();
    }

    /**
     * Método para ubtener el volumen de un producto
     *
     * @param type $idproducto
     *
     * @author Yoandi Díaz Ramos
     * @return el valor
     */
    public function calcularVolumen($idproducto)
    {
        $conn = Doctrine_Manager:: connection();
        $sql = "SELECT(nih.ancho * nih.alto * nih.largo) AS volumen
                FROM mod_logistica.dat_producto dp, mod_datosmaestros.nom_indicadorhoja nih
                WHERE dp.idindicador = nih.idindicador AND dp.idproducto = " . $idproducto;
        $resp = $conn->execute($sql);
        $result = $resp->fetchAll();
        return $result;
    }

    public function estadoVolumen($idestructuraubicacion)
    {
        $conn = Doctrine_Manager:: connection();
        $sql = 'SELECT dai.cantidad, nih.largo, nih.ancho, nih.alto
                FROM mod_logubicacion.dat_ubicacionproducto dai,
                     mod_logistica.dat_producto dtp,
                     mod_datosmaestros.nom_indicadorhoja nih
                WHERE dai.idubicacion = ' . $idestructuraubicacion
            . 'AND dai.idproducto = dtp.idproducto AND dtp.idindicador = nih.idindicador';
        $resp = $conn->execute($sql);
        $result = $resp->fetchAll();
        return $result;
    }

    /**
     * Método para ubtener el peso de un producto
     *
     * @param type $idproducto
     *
     * @author Yoandi Díaz Ramos
     * @return el valor
     */
    public function calcularPeso($idproducto)
    {
        $conn = Doctrine_Manager:: connection();
        $sql = "SELECT nih.peso
               FROM mod_logistica.dat_producto dp,
                    mod_datosmaestros.nom_indicadorhoja nih
               WHERE dp.idindicador = nih.idindicador AND dp.idproducto = " . $idproducto;
        $resp = $conn->execute($sql);
        $result = $resp->fetchAll();
        return $result;
    }

    public function estadoPeso($idestructuraubicacion)
    {
        $conn = Doctrine_Manager:: connection();
        $sql = 'SELECT dai.cantidad, nih.peso
            FROM mod_logubicacion.dat_ubicacionproducto dai, mod_logistica.dat_producto dtp,
                mod_datosmaestros.nom_indicadorhoja nih
            WHERE dai.idubicacion = ' . $idestructuraubicacion
            . 'AND dai.idproducto = dtp.idproducto AND dtp.idindicador = nih.idindicador';
        $resp = $conn->execute($sql);
        $result = $resp->fetchAll();
        return $result;
    }

    public function estadoCapacidad($idestructuraubicacion)
    {
        $query = Doctrine_Query::create()
            ->select('sum(up.cantidad)')
            ->from('DatUbicacionproducto up')
            ->where('up.idubicacion = ?', $idestructuraubicacion);
        return $query->fetchArray();
    }

    /**
     * Método para obtener parámetros del producto como el peso y el volumen
     *
     * @param type $idproducto
     *
     * @author Yoandi Díaz Ramos
     * @return valores
     */
    public function getParametros($idproducto)
    {
        $conn = Doctrine_Manager:: connection();
        $sql = "SELECT nih.peso ,(nih.ancho * nih.alto * nih.largo) AS volumen
                FROM mod_logistica.dat_producto dp, mod_datosmaestros.nom_indicadorhoja nih
                WHERE dp.idindicador = nih.idindicador AND dp.idproducto = " . $idproducto;
        $resp = $conn->execute($sql);
        $result = $resp->fetchAll();
        return $result;
    }

    public function getValoresAControlar($idestructuraubicacion)
    {
        if ($idestructuraubicacion == '') {
            return array();
        }
        $query = Doctrine_Query::create()
            ->select(
                'eu.idestructuraubicacion, eu.idpadre, ntu.codigo AS codigo, nctu.capacidad AS capacidad, '
                . 'nctu.volumen AS volumen, nctu.peso AS peso, nctu.producto AS productounico'
            )
            ->from('DatEstructuraubicacion eu')
            ->innerJoin('eu.NomTipoubicacion ntu')
            ->innerJoin("ntu.NomCampostipoubicacion nctu ON nctu.idtipoubicacion = ntu.idtipoubicacion")
            ->where('eu.idestructuraubicacion = ?', $idestructuraubicacion);
        return $query->fetchArray();
    }

    /**
     * Método para obtener los datos del arobol  si no estas en el ultimo nivel del mismo.
     *
     * @param type $idestructuraubicacion
     *
     * @author Yoandi Díaz Ramos
     * @return array
     */
    public function getDatosArbol($idestructuraubicacion)
    {
        if ($idestructuraubicacion == '') {
            return array();
        }
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT eu.descripcion, eu.idestructuraubicacion
                FROM mod_logubicacion.dat_estructuraubicacion eu
                INNER JOIN mod_logubicacion.dat_estructuraubicacion padre 
                    ON eu.ordenizq >= padre.ordenizq AND eu.ordender <= padre.ordender AND padre.idarbol = eu.idarbol
                WHERE padre.idestructuraubicacion = {$idestructuraubicacion}
                ORDER BY eu.ordenizq";
        $res = $conn->execute($sql);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function getDatosArbolDenominacion($idestructuraubicacion, $sigP = '>', $sigS = '<')
    {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT eu.descripcion
                FROM mod_logubicacion.dat_estructuraubicacion eu
                INNER JOIN mod_logubicacion.dat_estructuraubicacion padre
                    ON eu.ordenizq {$sigP}= padre.ordenizq AND eu.ordender {$sigS}= padre.ordender 
                        AND padre.idarbol = eu.idarbol
                WHERE padre.idestructuraubicacion = {$idestructuraubicacion}
                ORDER BY eu.ordenizq";
        $res = $conn->execute($sql);
        $result = $res->fetchAll(PDO::FETCH_COLUMN);
        return $result;
    }

    /**
     * Método para cargar las ubicaciones existentes en las estructuras de ubicación
     *
     * @param type $idproducto
     *
     * @author Yoandi Díaz Ramos
     * @return array
     */
    public function cargarUbicacionesExistencia($idproducto)
    {
        $conn = Doctrine_Manager:: connection();
        $sql = 'SELECT DISTINCT 
                    de.idestructuraubicacion, da.cantidad AS cantubicada, de.descripcion, de.idarea, de.idpadre
                FROM mod_logubicacion.dat_ubicacionproducto da, mod_logubicacion.dat_estructuraubicacion de,
                    mod_logubicacion.dat_areaproducto ae
                WHERE da.idubicacion = de.idestructuraubicacion AND ae.idarea = de.idarea AND da.idproducto = '
            . $idproducto;
        $resp = $conn->execute($sql);
        $result = $resp->fetchAll();
        return $result;
    }

    /**
     * Método para validar el producto único
     *
     * @param type $idestructuraubicacion and $idproducto
     *
     * @author Yoandi Díaz Ramos
     * @return array
     */
    public function validarProducto($idestructuraubicacion, $idindicador)
    {
        $conn = Doctrine_Manager:: connection();
        $sql = "SELECT dv.idproducto
                FROM mod_logubicacion.dat_valorescampostipoubicacion dv
                WHERE dv.idproducto = {$idindicador} AND dv.idestructuraubicacion = {$idestructuraubicacion}";
        $resp = $conn->execute($sql);
        $result = $resp->fetchAll();
        return $result;
    }

    public function obtenerPadresById($idestructrura, $idproducto = 0, $idlotebulto = 0)
    {
        $query = new Doctrine_Query();
        $arrC = array();
        $res = Doctrine::getTable('DatEstructuraubicacion')->find(
            $idestructrura
        );
        $arrC['lft'] = $res->ordenizq;
        $arrC['rgt'] = $res->ordender;
        $arrFiltro [] = " deu.ordenizq < :lft ";
        $arrFiltro [] = " deu.ordender > :rgt ";
        $from = 'DatEstructuraubicacion deu';
        if ($idproducto) {
            $from .= ',deu.DatUbicacionProducto dua';
            $arrFiltro [] = " dua.idproducto = :idproducto ";
            $arrFiltro [] = " deu.idestructuraubicacion = dua.idestructuraubicacion";
            $arrC['idproducto'] = $idproducto;
        }
        if ($idlotebulto) {
            $from .= ',deu.DatUbicacionLote dul ';
            $arrFiltro [] = " dul.idlotebulto = :idlotebulto ";
            $arrFiltro [] = " deu.idestructuraubicacion = dul.idestructuraubicacion";
            $arrC['idlotebulto'] = $idlotebulto;
        }
        $filtro = implode(" AND ", $arrFiltro);
        $query->addWhere($filtro, $arrC);
        $result = $query->from($from)->fetchArray();
        return $result;
    }

}
