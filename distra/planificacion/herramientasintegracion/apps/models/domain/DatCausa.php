<?php

class DatCausa extends BaseDatCausa
{
    public static function getByid($idcausa) {
        return Doctrine::getTable('DatCausa')->findBy('idcausa', $idcausa)->getFirst();
    }

    public static function getByCausa($idcausa) {
        $query = Doctrine_Query::create();
        $query->select('causa.idcausa, causa.idpadre, causa.denominacion, (causa.rgt - causa.lft = 1) leaf');
        $query->from('DatCausa causa');
        $query->where('causa.idpadre = ? and causa.idcausa <> causa.idpadre', array($idcausa));
        return $query->execute()->toArray();
    }

    public static function getByCategoria($idcategoria) {
        $query = Doctrine_Query::create();
        $query->select('causa.idcausa, causa.idpadre, causa.denominacion, (causa.rgt - causa.lft = 1) leaf');
        $query->from('DatCausa causa');
        $query->where('causa.idcategoria = ? and causa.idcausa = causa.idpadre', array($idcategoria));
        return $query->execute()->toArray();
    }

    public static function listCausa($idcategoria, $idcausa) {
        $query = Doctrine_Query::create();
        $query->select('causa.idcausa, causa.idpadre, causa.denominacion, (causa.rgt - causa.lft = 1) leaf');
        $query->from('DatCausa causa');
        $query->where('causa.idcategoria = ? and causa.idcausa <> ? and causa.idcausa <> causa.idpadre', array($idcategoria, $idcausa));
        return $query->execute()->toArray();
    }

    public static function listCategoria($idcategoria) {
        $query = Doctrine_Query::create();
        $query->select('causa.idcausa, causa.idpadre, causa.denominacion, (causa.rgt - causa.lft = 1) leaf');
        $query->from('DatCausa causa');
        $query->where('causa.idcategoria = ?', array($idcategoria));
        return $query->execute()->toArray();
    }

    public static function buscarCausa($denominacion, $idcategoria) {
        $query = Doctrine_Query::create();
        $query->select('causa.idcausa, causa.idpadre, causa.denominacion, (causa.rgt - causa.lft = 1) leaf');
        $query->from('DatCausa causa');
        if($idcategoria){
            $query->where('causa.denominacion = ? and causa.idcategoria = ?', array($denominacion, $idcategoria));
        }else{
            $query->where('causa.denominacion = ?', array($denominacion));
        }

        return $query->execute()->toArray();
    }

    public static function findCausa($denominacion, $idcategoria, $idefecto) {
        $query = Doctrine_Query::create();
        $query->select('causa.idcausa, causa.idpadre, causa.denominacion, (causa.rgt - causa.lft = 1) leaf');
        $query->from('DatCausa causa');
        if($idcategoria == null) {
            $query->innerJoin('causa.DatCategoria categoria');
            $query->where('categoria.idefecto = ?', array($idefecto));
        }
        $query->addWhere("lower(causa.denominacion) LIKE lower ('%$denominacion%')");
        if($idcategoria != null) {
            $query->addWhere('causa.idcategoria = ?', array($idcategoria));
        }
        return $query->execute()->toArray();
    }
    
    /**
     * @copyright XETID Cuba
     * @author Ing Grabiel Montero Coello
     * @name getCausasByEstudio
     * @param $idEstudio : Identificador del estudio
     * @return mixed
     */
    public static function getCausasByEstudio($idEstudio, $start = null, $limit = null) {
        $query = Doctrine_Query::create();
        $query->select('c.*, ca.*, ef.*')->from('DatCausa c')
            ->innerjoin('c.DatCategoria ca')
            ->innerjoin('ca.DatEfecto ef')
            ->where('ef.idestudiocausaefecto =?', $idEstudio);
        $query = !is_null($start) ? $query->offset($start) : $query;
        $query = !is_null($limit) ? $query->limit($limit) : $query;
        $res = $query->fetchArray();
        if (!is_null($start) && !is_null($limit)) {
            $c = Doctrine_Query::create();
            $c->select('c.*, ca.*, ef.*')->from('DatCausa c')
                ->innerjoin('c.DatCategoria ca')
                ->innerjoin('ca.DatEfecto ef')
                ->where('ef.idestudiocausaefecto =?', $idEstudio);
            $cant = $c->fetchArray();
            return array('root' => $res, 'cantidad_filas' => count($cant));
        }
        return $res;
    }

    public function setUp() {
        parent:: setUp();
        $this->hasOne('DatCausa', array('local' => 'idpadre', 'foreign' => 'idcausa'));
        $this->hasOne('DatCategoria', array('local' => 'idcategoria', 'foreign' => 'idcategoria'));
        $this->hasMany('DatCausa', array('local' => 'idcausa', 'foreign' => 'idpadre'));
    }
}
