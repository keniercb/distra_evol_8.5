<?php

class DatElementoEstructuraCrea extends BaseDatElementoEstructuraCrea
{

    public function setUp()
    {
        parent::setUp();
        $this->hasMany(
            'DatElementos',
            array('local' => 'idelemento', 'foreign' => 'idelemento')
        );

    }

    public function addElementoEstructuraCrea($idelemento, $idestructuracrea)
    {
        $cadenaInsert
            = "INSERT INTO mod_objetivos.dat_elementoestructuracrea(idelemento, idestructuracrea)";
        $cadenaValues
            = "VALUES ($idelemento, $idestructuracrea)";
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadenaInsert . $cadenaValues);
        $result = $res->fetchAll();
        $connA->commit();
        $connA->beginTransaction();
        return $result;
    }
}

//fin clase 
