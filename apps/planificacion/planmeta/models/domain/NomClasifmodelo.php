<?php

class NomClasifmodelo extends BaseNomClasifmodelo
{

    public function setUp()
    {
        parent::setUp();
        $this->hasMany(
            'NomClasifmodelo',
            array('local' => 'idclasifmodelo', 'foreign' => 'idclasifmodelo')
        );
    }

    public function Buscar($idclasifmodelo)
    {
        $temp = $this->conn->getTable('NomClasifmodelo')->find($idclasifmodelo);
        return $temp->toArray();
    }

    public function GetTodos()
    {
        $query = new Doctrine_Query();
        $result = $query->from('NomClasifmodelo')->execute();
        return $result->toArray();
    }

    public function GetPorLimite($limite = 0, $inicio = 10)
    {
        $query = new Doctrine_Query();
        $result = $query->from('NomClasifmodelo')->limit($limite = 0)->offset(
            $inicio = 10
        )->execute();
        return $result->toArray();
    }

    //Esta función la llamo desde Plan y es para el combo Clases del Modelo
    public function obtenerCMCombo()
    {

        $query = new Doctrine_Query();
        //retorno lo que devuelve la consulta
        return $query->select("n.idclasifmodelo,n.denominacion")
            ->from("NomClasifmodelo n")
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
            ->execute();
    }

}


