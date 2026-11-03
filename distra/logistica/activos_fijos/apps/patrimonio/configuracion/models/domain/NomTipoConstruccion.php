<?php

class NomTipoConstruccion extends BaseNomTipoConstruccion {

    public function setUp() {
        parent::setUp();
        $this->hasOne('DatTipoConstruccionEntidad', array('local' => 'idtipoconstruccion', 'foreign' => 'idtipoconstruccion'));
        $this->hasMany('DatTipoMaterialConstruccion', array('local' => 'idtipoconstruccion', 'foreign' => 'idtipoconstruccion'));
    }
    public function getDatos($parametros)
     {
         $where = "";
         $conn = Zend_Registry::get('conexion');

         $sql = "select mm.idtipoconstruccion,
                mm.denominacion,
                mm.idtipoconstruccion as id,
                mm.denominacion as text,
                mm.estado, false as leaf";
         $sqlfrom = " from mod_logactivofijotangible.nom_tipoconstruccion mm
        ";

         $global = ZendExt_GlobalConcept::getInstance();
         $idestructura = $global->Estructura->idestructura;

         $sql.=", case when (select 1 from mod_logactivofijotangible.dat_tipoconstruccionentidad me
            where mm.idtipoconstruccion = me.idtipoconstruccion
            and me.idestructuracomun = {$idestructura}) = 1 then true else false end as usarentidad";

         if($parametros['denominacion']){
             $where.= "where mm.denominacion ILIKE '%{$parametros['denominacion']}%'";
         }

         return $conn->execute($sql . $sqlfrom .$where)->fetchAll(PDO::FETCH_ASSOC);

       }
    public function getCantDatos($parametros)
    { 
        unset($parametros['start']);
        unset($parametros['limit']);
         
        $query = new Doctrine_Query();

         $query->from('NomTipoConstruccion mm')->leftJoin('mm.DatTipoConstruccionEntidad me');


        $query = self::getWhere($query, 'mm', $parametros);

        if ($parametros['idnaturaleza']) {
            $query->addWhere("n.idnaturaleza = ?", $parametros['idnaturaleza']);
        }
       
        return $query->count();
    }    
    private function getWhere($query, $alias, $parametros,$aliasentidad)
    {
        if (!$query) {
            $query = new Doctrine_Query();
        }
        if ($parametros['denominacion']) {
            $query->addWhere("$alias.denominacion iLike '%{$parametros['denominacion']}%'");
        }

        if ($parametros['limit']) {
            $query->offset($parametros['start']);
            $query->limit($parametros['limit']);
        }

        return $query;
    }
    public function isTipoConstruccionDuplicada($parametros)
    {
        $query = new Doctrine_Query();
        $query->from('NomTipoConstruccion mm');
        $query->addWhere("mm.denominacion iLike '{$parametros['denominacion']}'");
        $respuesta = $query->fetchArray();   

        if (count($respuesta) == 0) {
            return 1;
        }else{
            return 2;
        }     
    }
    
    
    
    

    
    
   

}
