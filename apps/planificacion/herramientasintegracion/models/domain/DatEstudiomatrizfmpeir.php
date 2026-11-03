<?php

class DatEstudiomatrizfmpeir extends BaseDatEstudiomatrizfmpeir
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne('DatProyecto', array('local' => 'idproyecto', 'foreign' => 'idproyecto'));
        $this->hasMany('DatMatrizfmpeir', array('local' => 'idestudiomatrizfmpeir', 'foreign' => 'idestudiomatrizfmpeir'));
    }

    public function obtenerEstudioByProyecto($idproyecto)
    {
        return Doctrine::getTable('DatEstudiomatrizfmpeir')->findBy('idproyecto', $idproyecto)->getFirst();
    }

    public function obtenermatrizfmpeir($p)
    {
        $q = Doctrine_Query::create()
            ->select("n.*,e.* ,el.*, ep.*, ind.* ")
            ->from('DatMatrizfmpeir n')->innerJoin('n.DatElementofuerzamotriz e')->innerJoin('e.NomFuerzamotriz el')->innerJoin('e.NomElementopeir ep')->innerJoin('e.DatIndicadorfmpeir ind');
        $q = (p !== '') ? $q->addWhere('n.idestudiomatrizfmpeir =?', $p) : $q;
        $res = $q->fetchArray();
        return $res;
    }

    public function saveinfo($obj)
    {
        if ($obj) {
            $obj->save();
        }
        return $obj->idestudiomatrizfmpeir;
    }

    public function obtenerdatosmatriz($p)
    {

        $q = Doctrine_Query::create()
            ->select("n.*")
            ->from('DatMatrizfmpeir n')->innerJoin('n.DatElementofuerzamotriz e')->innerJoin('e.NomFuerzamotriz el')->innerJoin('e.NomElementopeir ep')->innerJoin('e.DatIndicadorfmpeir ind');
        $q = ($p['idestudiomatrizfmpeir']) ? $q->addWhere('n.idestudiomatrizfmpeir =?', $p['idestudiomatrizfmpeir']) : $q;
        $q = ($p['orden'] !== '') ? $q->addWhere('n.orden =?', $p['orden']) : $q;
        $q = ($p['idfuerzamotriz']) ? $q->addWhere('el.idfuerzamotriz =?', $p['idfuerzamotriz']) : $q;
        $q = ($p['denominacion']) ? $q->addWhere('ind.denominacion =?', $p['denominacion']) : $q;
        $res = $q->fetchArray();
        return $res;
    }

    public function getByid($idestudiomatrizfmpeir)
    {
        return Doctrine::getTable('DatEstudiomatrizfmpeir')->find($idestudiomatrizfmpeir)->toArray();
    }

    public function obtenerElementopeir()
    {
        $select = ' select ne.denominacion as text, (false) as leaf, ne.* ';
        $from = ' from mod_planifintegracion.nom_fuerzamotriz ne order by ne.orden asc';
        $sql = $select . $from;
        $result = Doctrine_Manager::getInstance()->getCurrentConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function obtenerNodosHijos($p, $caso)
    {
        $select = ' select ne.denominacion as text, (true) as leaf, ne.*';
        $from = ' from mod_planifintegracion.nom_elementopeir ne ';
        $sql = $select . $from;
        $result = Doctrine_Manager::getInstance()->getCurrentConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        foreach ($result as $pos => $res) {
            $result[$pos]['idfuerzamotriz'] = $p;
            switch ($caso) {
                case 0:
//                    $result[$pos]['text'] = $res['denominacion'] . ' -> <b>' . $res['descripcionpresion'] . '</b>';
                    $result[$pos]['qtip'] = '<b>Descripción de presión : ' . $res['descripcionpresion'] . '</b>';
                    break;
                case 1:
//                    $result[$pos]['text'] = $res['denominacion'] . ' -> <b>' . $res['descripcionestado'] . '</b>';
                    $result[$pos]['qtip'] = '<b>Descripción de estado : ' . $res['descripcionestado'] . '</b>';
                    break;
                case 2:
//                    $result[$pos]['text'] = $res['denominacion'] . ' -> <b>' . $res['descripcionimpacto'] . '</b>';
                    $result[$pos]['qtip'] = '<b>Descripción de impacto : ' . $res['descripcionimpacto'] . '</b>';
                    break;
                default:
//                    $result[$pos]['text'] = $res['denominacion'] . ' -> <b>' . $res['descripcionrespuesta'] . '</b>';
                    $result[$pos]['qtip'] = '<b>Descripción de respuesta : ' . $res['descripcionrespuesta'] . '</b>';
                    break;

            }
        }
        return $result;
    }

    public function obtenerElementos($p)
    {
        $fechaIni = $p['fechaini'];
        $fechaFin = $p['fechafin'];
        $denominacion = $p['denominacion'];
        $q = Doctrine_Query::create()
            ->select("n.*")
            ->from('NomElementopeir n');
        $q = ($fechaIni !== '' && $fechaFin !== '') ? $q->addWhere('n.fechaini >=?', $fechaIni)->andWhere('n.fechafin <=?', $fechaFin) : $q;
        $q = ($fechaIni !== '' && (!($fechaIni !== '' && $fechaFin !== ''))) ? $q->addWhere('n.fechaini =?', $fechaIni) : $q;
        $q = ($fechaFin !== '' && (!($fechaIni !== '' && $fechaFin !== ''))) ? $q->addWhere('n.fechafin =?', $fechaFin) : $q;
        $q = ($denominacion !== '') ? $q->addWhere('lower(n.denominacion) LIKE ?', '%' . strtolower($denominacion) . '%') : $q;
        $res = $q->fetchArray();
        return $res;
    }

}
