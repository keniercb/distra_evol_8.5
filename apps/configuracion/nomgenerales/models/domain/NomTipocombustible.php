<?php 
class NomTipocombustible extends BaseNomTipocombustible
 { 
   public function setUp() {   
	parent::setUp(); 
        $this->hasOne('NomTipocombustible', array('local'=>'idtipocombustible','foreign'=>'idpadre')); 
   }

    public function ObtenerCombustible()
    {
        $query = Doctrine_Query::create();

        return $query->from(
            'NomTipocombustible g'
        )//  ->where("g.idtipocombustible NOT IN (SELECT h.idtipocombustible FROM NomTipocombustible h WHERE h.idpadre = g.idtipocombustible) AND g.estado = 1")
            ->where("g.estado = 1")->orderby('idtipocombustible')->setHydrationMode(Doctrine :: HYDRATE_ARRAY)->execute(
            );
    }
 
}//fin clase

