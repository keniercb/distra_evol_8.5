<?php

class DatElementoEstructuraUsa extends BaseDatElementoEstructuraUsa
{

    public function setUp()
    {
        parent::setUp();
        $this->hasMany(
            'DatElementoEstructuraCrea', array('local' => 'idelementoestructuracrea', 'foreign' => 'idelementoestructuracrea')
        );
      
    }
}

//fin clase 
