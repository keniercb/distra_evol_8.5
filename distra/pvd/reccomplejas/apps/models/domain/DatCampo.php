<?php

class DatCampo extends BaseDatCampo
{

    public function setUp()
    {
        parent :: setUp();
        $this->hasOne('DatCampo', array('local' => 'idpadre', 'foreign' => 'idcampo'));
        $this->hasOne('NomConfiguracion', array('local' => 'idconfiguracion', 'foreign' => 'idconfiguracion'));
        $this->hasMany('DatCampo', array('local' => 'idcampo', 'foreign' => 'idpadre'));
        $this->hasMany('DatConfigcondicion', array('local' => 'idcampo', 'foreign' => 'idcampo'));
        $this->hasOne('DatConfigmostrar', array('local' => 'idcampo', 'foreign' => 'idcampo'));
        $this->hasMany('DatMapeo', array('local' => 'idcampo', 'foreign' => 'idcampo'));
        $this->hasMany('DatMultievaluado', array('local' => 'idcampo', 'foreign' => 'idcampo'));
        $this->hasMany('SegCampo', array('local' => 'idcampo', 'foreign' => 'idcampo'));
        $this->hasMany('SegFiltro', array('local' => 'idcampo', 'foreign' => 'idcampo'));
    }

    public function getCampos($idconfiguracion, $idpadre)
    {
        $conn = Doctrine_Manager::getInstance()->getCurrentConnection();
        $sql = "SELECT dc.idcampo, dc.idpadre, dc.denominacion as text, dc.descripcion, dc.descripcion as qtip,
                    dc.esquema, dc.tabla, dc.campo,dc.alias,
                    (CASE WHEN dc.campo is null THEN false ELSE true END) as leaf,
                    (CASE WHEN dc.campo is not null AND cm.icono is not null THEN cm.icono ELSE null END) as icon,
                    (CASE WHEN dc.campo is null THEN 'folder' WHEN cm.icono is null THEN 'tag_blue' ELSE null END) as \"iconCls\",
                    cm.idconfigmostrar, cm.obligatorio, cm.anchocolumna, cm.expander, cm.agruparcampo, cm.tooltip,
                    cm.oculto, cm.sqlselect, cm.renderer,
                    (CASE WHEN cc.usarcondicion is null THEN 0 ELSE cc.usarcondicion END) as usarCondicion,cc.usarreemplazar,
                    cc.idconfigcondicion, cc.tipodato, cc.representartbar,cc.condicionpordefecto, cc.expresionregular,
                    cc.sqlwhere,cc.sqlfilter, cc.idtabla
                FROM mod_reccomplejas2.dat_campo dc
                LEFT JOIN mod_reccomplejas2.dat_configmostrar cm ON(dc.idcampo=cm.idcampo)
                LEFT JOIN mod_reccomplejas2.dat_configcondicion cc ON(dc.idcampo=cc.idcampo)
                WHERE dc.idconfiguracion='{$idconfiguracion}' ";

        if ($idpadre === 'null') {
            $sql .= ' AND dc.idpadre IS NULL order by dc.index';
        } else {
            $sql .= " AND dc.idpadre={$idpadre} order by dc.index";
        }

        return $conn->fetchAll($sql);
    }

    /**
     * Devuelve todos los campos de una configuracion
     */
    public function getCamposConfiguracion($idconfiguracion)
    {
        $query = Doctrine_Manager::getInstance()->getCurrentConnection();
        $sql = "SELECT dc.index,dc.idcampo,dc.idconfiguracion,dc.idpadre,dc.denominacion as text,dc.descripcion as qtip,
                    dc.campo, dc.denominacion, dc.descripcion,dc.esquema,dc.tabla,
                    (CASE WHEN dc.campo is null THEN false ELSE true END) as leaf,
                    (CASE WHEN dc.alias is null OR dc.alias = '' THEN '_' || dc.idcampo ELSE dc.alias END) AS alias,
                    cm.anchocolumna,cm.obligatorio,cm.expander,cm.agruparcampo,cm.tooltip,cm.oculto,cm.sqlselect,
                    cm.renderer, cc.usarcondicion,cc.usarreemplazar,cc.usarreemplazar,cc.tipodato,cc.representartbar,cc.condicionpordefecto,
                    (CASE WHEN dc.campo is null THEN NULL WHEN cm.obligatorio = 1 THEN true ELSE false END) as checked,
                    cc.expresionregular, cc.sqlwhere, cc.sqlfilter, cc.idtabla FROM mod_reccomplejas2.dat_campo dc
                LEFT JOIN mod_reccomplejas2.dat_configmostrar cm ON(dc.idcampo=cm.idcampo)
                LEFT JOIN mod_reccomplejas2.dat_configcondicion cc ON(dc.idcampo=cc.idcampo)
                WHERE dc.idconfiguracion='{$idconfiguracion}'
                ORDER BY dc.index;";

        return $query->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getMapeoConfiguracion($idconfiguracion)
    {
        $query = Doctrine_Manager::getInstance()->getCurrentConnection();
        $sql = "SELECT c.idcampo, m.idmapeo as idmapeo, u.idunion as idunion, c.esquema as esquemacampo,
                    c.tabla as tablacampo, m.esquema, m.tabla, m.persistejoin, m.idpersistejoin, m.tipoconexion,
                    u.campoinicial, u.operador, u.campofinal, u.logico
                FROM mod_reccomplejas2.dat_campo c
                INNER JOIN mod_reccomplejas2.dat_mapeo m ON (c.idcampo = m.idcampo)
                LEFT JOIN mod_reccomplejas2.dat_union u ON (m.idmapeo = u.idmapeo)
                WHERE c.idconfiguracion='{$idconfiguracion}'
                ORDER BY m.idmapeo, u.idunion ASC";

        return $query->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getMultiplesValores($idconfiguracion)
    {
        $query = Doctrine_Manager::getInstance();
        $sql = "SELECT dc.idcampo, me.valor, me.denominacion
            FROM mod_reccomplejas2.dat_campo dc
            INNER JOIN mod_reccomplejas2.dat_multievaluado me ON(dc.idcampo = me.idcampo)
            WHERE dc.idconfiguracion='{$idconfiguracion}'
            ORDER BY dc.idcampo, me.valor ASC";
        $arrAux = $query->getCurrentConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);

        return $arrAux;
    }

    public function getArrConfigMostrar($idconfiguracion)
    {
        $query = Doctrine_Manager::getInstance();
        $sql = "SELECT dc.esquema,dc.tabla,dc.campo,dc.alias,cm.*
            FROM mod_reccomplejas2.dat_campo dc
            INNER JOIN mod_reccomplejas2.dat_configmostrar cm ON(dc.idcampo=cm.idcampo)
            WHERE dc.idconfiguracion='{$idconfiguracion}'
            ORDER BY dc.idcampo";
        $arrAux = $query->getCurrentConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);

        return $arrAux;
    }

    public function getArrConfigCondicion($idconfiguracion)
    {
        $query = Doctrine_Manager::getInstance();
        $sql = "SELECT dc.esquema,dc.tabla,dc.campo,cc.*
            FROM mod_reccomplejas2.dat_campo dc
            INNER JOIN mod_reccomplejas2.dat_configcondicion cc ON(dc.idcampo=cc.idcampo)
            WHERE dc.idconfiguracion ='{$idconfiguracion}'
            ORDER BY dc.idcampo";
        $arrAux = $query->getCurrentConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);

        return $arrAux;
    }

    public function verificarCampo($idconfiguracion, $alias, $idcampo)
    {
        try {
            if ($alias) {
                $query = new Doctrine_Query ();
                $result = $query->select('dat.idcampo')
                    ->from('DatCampo dat')
                    ->where(
                        "dat.idconfiguracion=? and dat.alias=? and dat.idcampo<>?",
                        array($idconfiguracion, $alias, $idcampo)
                    )
                    ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                    ->execute();

                return $result;
            } else {
                return false;
            }

        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    /**
     * Agregar a una consulta las sentencias necesarias para obtener los datos de los campos de una configuracion.
     *
     * @param                $idconfiguracion      Identificador de la configuracion.
     * @param Doctrine_Query $objDoctrineQuery Consulta a la cual se le quiere agregar las sentencias DQL.
     * @param string $aliasTablaReferencia Alias de la clase de dominio que tiene relación con la clase.
     * @param string $aliasTabla Alias para la tabla DatCampo.
     * @param string $includeDqlSelect Si se van a devolver datos de los campos.
     *
     * @return Doctrine_Query Consulta modificada con las sentencias que devuelven los datos de la configuracion.
     */
    public function addDqlDatCampo(
        $idconfiguracion, Doctrine_Query $objDoctrineQuery, $aliasTablaReferencia, $aliasTabla, $includeDqlSelect
    )
    {
        if ($includeDqlSelect) {
            $objDoctrineQuery->addSelect(
                "$aliasTabla.idcampo AS idcampo, $aliasTabla.denominacion AS denominacion,
                $aliasTabla.descripcion AS descripcion"
            );
        }
        $objDoctrineQuery->innerJoin("$aliasTablaReferencia.DatCampo $aliasTabla");

        //Verifica el identificador de la configuracion
        if ($idconfiguracion) {
            $objDoctrineQuery->addWhere("$aliasTabla.idconfiguracion = ? ", $idconfiguracion);
        }

        return $objDoctrineQuery;
    }

}