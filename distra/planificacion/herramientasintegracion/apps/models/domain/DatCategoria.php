<?php

class DatCategoria extends BaseDatCategoria {

    public function setUp() {
        parent :: setUp();
        $this->hasOne('DatEfecto', array('local' => 'idefecto', 'foreign' => 'idefecto'));
        $this->hasMany('DatCausa', array('local' => 'idcategoria', 'foreign' => 'idcategoria'));
    }

    public static function getByid($idcategoria) {
        return Doctrine::getTable('DatCategoria')->findBy('idcategoria', $idcategoria)->getFirst();
    }
    
    public static function getByEfecto($idefecto) {
        return Doctrine::getTable('DatCategoria')->findBy('idefecto', $idefecto)->toArray();
    }
    
    public static function getByParams($idefecto, $offset, $limit) {
        $query = Doctrine_Query::create();
        $query->select('categoria.idcategoria, categoria.denominacion');
        $query->from('DatCategoria categoria');
        $query->where('categoria.idefecto = ?', array($idefecto));
        $query->offset($offset);
        $query->limit($limit);
        return $query->execute()->toArray();        
    }
    
    public static function getByDiagram($idefecto) {
        $query = Doctrine_Query::create();
        $query->select('categoria.*, causa.*');        
        $query->from('DatCategoria categoria');
        $query->leftJoin('categoria.DatCausa causa');
        $query->where('categoria.idefecto = ?', array($idefecto))->orderBy('categoria.idcategoria asc, causa.idcausa asc');
        return $query->execute()->toArray();  
    }
    
    public static function buscarCategoria($denominacion, $idefecto) {
        $query = Doctrine_Query::create();
        $query->select('categoria.*');        
        $query->from('DatCategoria categoria');
        if($idefecto){
            $query->where('categoria.denominacion = ? and categoria.idefecto = ?', array($denominacion, $idefecto));
        }else{
            $query->where('categoria.denominacion = ?', array($denominacion));
        }
        return $query->execute()->toArray();
    }
    
    public static function findCategoria($denominacion, $idefecto) {
        $query = Doctrine_Query::create();
        $query->select('categoria.*');        
        $query->from('DatCategoria categoria');        
        $query->where("lower(categoria.denominacion) LIKE lower ('%$denominacion%') and categoria.idefecto = ?", array($idefecto));    
        return $query->execute()->toArray();
    } 

}
