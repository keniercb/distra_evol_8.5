<?php

class DatElementonivelactividad extends BaseDatElementonivelactividad
{
    public function setUp()
    {
        parent::setUp();
		 parent :: setUp();
        $this->hasOne('DatElemento', array('local' => 'idelemento', 'foreign' => 'idelemento'));   

        $this->hasMany('DatElementonivelactividadporfecha', array('local' => 'idactividadentidad', 'foreign' => 'idactividadentidad'));  		
        

    }



}//fin clase 
?>


