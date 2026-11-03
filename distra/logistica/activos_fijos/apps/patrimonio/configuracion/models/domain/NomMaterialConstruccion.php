<?php

class NomMaterialConstruccion extends BaseNomMaterialConstruccion
{
    public function setUp()
    {    
        parent::setUp();
        $this->hasMany('DatTipoMaterialConstruccion', array('local' => 'idmaterialesconstruccion', 'foreign' => 'idmaterialesconstruccion'));
        $this->hasOne('DatMatConsInmuCamp', array('local' => 'idmaterialesconstruccion', 'foreign' => 'idmaterialconstruccion'));
      
    }
    
    private function getWhere($query, $alias, $parametros)
    {
        if (!$query) {
            $query = new Doctrine_Query();
        }
        if ($parametros['denominacion']) {
            $query->addWhere("$alias.denominacion iLike '%{$parametros['denominacion']}%'");
        }

        if ($parametros['idpadre']) {
            $query->addWhere("mm.idtipoconstruccion = ?", $parametros['idpadre']);
        }

        if ($parametros['limit']) {
            $query->offset($parametros['start']);
            $query->limit($parametros['limit']);
        }

        return $query;
    }

    public function getDatos($parametros)
    {
     
        $query = new Doctrine_Query();

        $query->from('NomMaterialConstruccion mod')
            ->innerJoin('mod.DatTipoMaterialConstruccion mm')
            ->innerJoin('mm.NomTipoConstruccion m');

        $query->addSelect(
            'mod.idmaterialesconstruccion, mod.denominacion, mod.idmaterialesconstruccion as id, '
            . 'mod.denominacion as text, mod.estado, true as leaf, mod.fechainicio as fechainicio, '
            . 'mod.fechafin as fechafin'
        );

        $query = self::getWhere($query, 'mod', $parametros);
        
         

        return $query->fetchArray();
    }
    
    
     public function getCantDatos($parametros)
    {      
        unset($parametros['start']);
        unset($parametros['limit']);
       
        $query = new Doctrine_Query();

        $query->from('NomMaterialConstruccion mod')->innerJoin('mod.DatTipoMaterialConstruccion mm')->innerJoin(
            'mm.NomTipoConstruccion n'
        );

        $query = self::getWhere($query, 'mod', $parametros);
       
        return $query->count();
    }
    
     public function isMaterialConstruccionDuplicado($parametros)
    {
        $query = new Doctrine_Query();
        $query->from('NomMaterialConstruccion mm')
            ->innerJoin('mm.DatTipoMaterialConstruccion mod')
            ->innerJoin('mod.NomTipoConstruccion m');
        $query->addWhere("mm.denominacion iLike '{$parametros['denominacion']}'");
        $query->addWhere('mod.idtipoconstruccion = ?', array($parametros['idpadre']));
        $respuesta = $query->fetchArray();
 
        if (count($respuesta) == 0) {
            return 1;
        }else{
            return 3;
        }         
    }
    
     public function getRealacionesMC($idmaterialesconstruccion)
    {
        return Doctrine::getTable('DatTipoMaterialConstruccion')->findByDql(
            'idmaterialesconstruccion = ?', array($idmaterialesconstruccion)
        );
    }
    
    
    
}