<?php

class SegCampo extends BaseSegCampo
{

    public function setUp()
    {
        parent :: setUp();
        $this->hasOne ('DatCampo', array ('local' => 'idcampo', 'foreign' => 'idcampo'));
        //$this->hasMany('SegFiltro', array('local' => 'idsegcampo', 'foreign' => 'idsegcampo'));
    }

    /**
     * Devuelve la compartimentacion en funcion de un rol
     *
     * @param $idconfiguracion
     * @param $idrol
     */
    public function getSegCampo($idconfiguracion, $idrol)
    {
        $query = new Doctrine_Query ();
        $result = $query->select(
            "c.idcampo, c.idpadre, c.denominacion as text, c.descripcion as qtip, sc.idsegcampo as idsegcampo,
            cc.tipodato as tipodato, sf.idfiltro, sf.condicion, sf.valor, sf.valormostrar, sf.logico, sf.idcampo, sf.orden,
            (CASE WHEN c.campo is null THEN false ELSE true END) as leaf,
            (CASE WHEN cm.obligatorio = 1 THEN true ELSE false END) as disabled,
            (CASE WHEN (cm.obligatorio = 1 OR sc.idsegcampo is not null) THEN true ELSE false END) as acceso,
            (CASE WHEN c.campo is null THEN 'folder' ELSE 'tag_blue' END) as iconCls,
            'col' as uiProvider"
        )
            ->from('DatCampo c')
            ->leftJoin('c.DatConfigmostrar cm')
            ->leftJoin('c.DatConfigcondicion cc')
            ->leftJoin("c.SegCampo sc ON (c.idcampo = sc.idcampo AND sc.idrol = {$idrol})")
            ->leftJoin("c.SegFiltro sf ON (c.idcampo = sf.idcampo AND sf.idrol = {$idrol})")
            ->orderBy('c.idcampo ASC, sf.idfiltro ASC')
            ->where('c.idconfiguracion=?', $idconfiguracion)
            ->fetchArray();

        return $result;
    }

    public function getSegCampoByRol($idconfiguracion, $idrol)
    {
        $query = Doctrine_Query::create();
        $query->select('s.idcampo')
            ->from('SegCampo s')
            ->innerJoin('s.DatCampo c')
            ->where('c.idconfiguracion = ? AND s.idrol = ?', array($idconfiguracion, $idrol));

        return $query->fetchArray();
    }

    public function getListAccess($idconfiguracion)
    {
        $query = Doctrine_Query::create();
        $query->select('sc.idsegcampo, sc.idcampo, sc.idrol')
            ->from('SegCampo sc')
            ->innerJoin('sc.DatCampo c')
            ->orderBy('sc.idrol, sc.idcampo')
            ->where('c.idconfiguracion = ?', $idconfiguracion);

        return $query->fetchArray();
    }

}