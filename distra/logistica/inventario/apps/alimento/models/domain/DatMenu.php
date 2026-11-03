<?php

class DatMenu extends BaseDatMenu
{
    public function setUp()
    {
        //$this->hasOne('NomCentroGrupo', array('local' => 'idcentrocosto', 'foreign' => 'idcentrogrupo'));
        $this->hasMany('NomNorma', array('local' => 'idnorma', 'foreign' => 'idnorma'));
        $this->hasMany('DatActividad', array('local' => 'idmenu', 'foreign' => 'idmenu'));
        $this->hasMany('DatProductoMenu', array('local' => 'idmenu', 'foreign' => 'idmenu'));
        $this->hasOne('DatDocumento', array('local' => 'idmenu', 'foreign' => 'iddocumento'));
        parent::setUp();
    }

    /**
     * 
     * @param Doctrine_Query $query
     * @param array $pDatos
     * @return Doctrine_Query
     */
    public function getSelectSinAlias(Doctrine_Query $query, $pDatos = array())
    {
        $query->addSelect(
                "dm.fecha AS fechaconsumo, "
                . "dm.idcentrocosto AS idcentrogrupo, "
                . "nn.denominacion AS denominacionnorma, "
                . "da.cantraciones AS cantraciones, "
                . "da.idactividad AS idactividad, "
                . "da.orden AS orden, "
                . "dm.idrevisadopor AS idrevisadopor, "
                . "dm.idnorma AS idnorma, "
                . "dpm.iddeposito AS iddeposito, "
                . "(SELECT (CASE WHEN se.idusuario IS NOT NULL AND dm.idrevisadopor IS NOT NULL THEN se.nombreusuario ELSE '-' END) "
                . "FROM SegUsuario se WHERE se.idusuario = d.idusuario) AS denominacionrevisado, "
                . "(SELECT STRING_AGG(na.denominacion, ',') FROM NomActividadalimento na "
                . "LEFT JOIN na.DatActividad da2 WHERE da2.idmenu = d.iddocumento) AS dactividades, "
                . "(SELECT COUNT(pm.idproductomenu) FROM DatProductoMenu pm INNER JOIN pm.DatMenu m2 "
                . "ON m2.idmenu = pm.idmenu INNER JOIN m2.DatDocumento d2 ON d2.iddocumento = m2.idmenu "
                . "WHERE pm.idmenu = d.iddocumento AND d2.idestructuracomun = d.idestructuracomun) AS cantproductos"
            )
            ->innerJoin("d.DatMenu dm")
            ->leftJoin("dm.NomNorma nn")
            ->leftJoin("dm.DatActividad da")
            ->leftJoin("dm.DatProductoMenu dpm")
            ->orderBy('dm.fecha DESC');
        if (is_numeric($pDatos['criterio'])) {
            $query->addWhere("d.nrodoc = ?", array($pDatos['criterio']));
        }
        return $query;
    }

    public function getWhereMenu(Doctrine_Query $query, $parametros)
    {
        $query->addWhere(
            "dm.idmenu = ? and da.idactividadalimento",
            array(
            $parametros['iddocumento'],
            $parametros['idComponent']
            )
        );
        return $query;
    }

    public function getProductosActividades($pDatos = array())
    {
        $conn = Zend_Registry::get('conexion');
        $filtro = "";
        if ($pDatos['criterio']) {
            $filtro = " AND ni.denominacion ILIKE '%{$pDatos['criterio']}%'";
        }
        $query = "SELECT distinct
                    dpr.idindicador,
                    (SELECT sum(prc.cantidad) 
                    FROM mod_logalimento.dat_recetaactividad rac
                    INNER JOIN mod_logalimento.dat_productoreceta prc on prc.idreceta = rac.idreceta
                    WHERE prc.idindicador = ni.idindicador and rac.idactividad = da.idactividad) as cantidad,
                    na.denominacion as tipoactividadetalle,
                    da.idactividad,
                    da.cantraciones as cantraciones,
                    ni.denominacion as denominacion,
                    COALESCE(um.abreviaturaunidadmedida, 'ninguna') as umedida ,
                    (SELECT sum(prc.cantidad) * da.cantraciones
                        FROM  mod_logalimento.dat_recetaactividad rac
                        INNER JOIN mod_logalimento.dat_productoreceta prc on prc.idreceta = rac.idreceta
                        WHERE prc.idindicador = ni.idindicador and rac.idactividad = da.idactividad) as cantidadtotal
                    FROM mod_logalimento.dat_actividad da
                    INNER JOIN mod_logalimento.dat_recetaactividad dra on dra.idactividad = da.idactividad
                    INNER JOIN mod_logalimento.dat_productoreceta dpr on dpr.idreceta = dra.idreceta
                    INNER JOIN mod_datosmaestros.nom_indicador ni on ni.idindicador = dpr.idindicador
                    LEFT JOIN mod_datosmaestros.nom_unidadmedida um on um.idunidadmedida = ni.idumedida
                    LEFT JOIN mod_logalimento.nom_actividadalimento na 
                    on na.idactividadalimento = da.idactividadalimento
                    WHERE da.idmenu = {$pDatos['iddocumento']} {$filtro}
                    ORDER BY na.denominacion";

        return $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getProductosMenu($pDatos = array())
    {
        $conn = Zend_Registry::get('conexion');
        $query = "SELECT DISTINCT
            dpr.idindicador,
            COALESCE(sum(dpr.cantidad * da.cantraciones), 0) as cantidadtotal
            FROM mod_logalimento.dat_productoreceta dpr
            INNER JOIN mod_logalimento.nom_receta nr on nr.idreceta = dpr.idreceta
            INNER JOIN mod_logalimento.dat_recetaactividad dra on dra.idreceta = nr.idreceta
            INNER JOIN mod_logalimento.dat_actividad da on da.idactividad = dra.idactividad
            WHERE da.idmenu = {$pDatos['iddocumento']}
            GROUP BY dpr.idindicador";
        $res = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return $res;
    }

    public function getCaloriasProteinas($pDatos = array())
    {
        $cal = 0;
        $prot = 0;
        foreach ($pDatos as $value) {
            $nReceta = Doctrine::getTable('NomReceta')->find($value);
            $cal += $nReceta->calorias;
            $prot += $nReceta->proteinas;
        }
        return array('calorias' => $cal, 'proteinas' => $prot);
    }

}
