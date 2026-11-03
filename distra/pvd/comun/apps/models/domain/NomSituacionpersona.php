<?php
class NomSituacionpersona extends BaseNomSituacionpersona
{
    public function setUp()
    {
        parent::setUp();

    }

    public function Buscar($idsituacionpersona)
    {
        $temp = $this->conn->getTable('NomSituacionpersona')->find($idsituacionpersona);
        return $temp->toArray();

    }

    public function GetTodos()
    {
        $query = new Doctrine_Query ();
        $result = $query->from('NomSituacionpersona')->execute();
        return $result; //->toArray()

    }

    public function GetPorLimite($limite = 10, $inicio = 0)
    {
        $query = new Doctrine_Query ();
        $result = $query->from('NomSituacionpersona')->limit($limite = 10)->offset($inicio = 0)->execute();
        return $result->toArray();

    }

    public function obtenersituacionesgenerales()
    {
        $query = new Doctrine_Query();
        $result = $query->select("nsp.idsituacionpersona as id,  nsp.denom")
            ->from('NomSituacionpersona nsp')
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
            ->execute();
        return $result;
    }

    public function getIdSituacionByAlia($alia){
        $query = new Doctrine_Query();
        $result = $query->select("idsituacionpersona")
            ->from('NomSituacionpersona')
            ->where('alias = ?', $alia)
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
            ->execute();
        return $result;
    }

}

//fin clase
?>


