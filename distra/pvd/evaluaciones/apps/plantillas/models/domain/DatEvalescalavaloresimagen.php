<?php

class DatEvalescalavaloresimagen extends BaseDatEvalescalavaloresimagen {

    public function setUp() {
        parent::setUp();
        $this->hasMany('DatEvalescala', array('local' => 'idescala', 'foreign' => 'idescala'));
        $this->hasMany('NomEvalvaloresimagenes', array('local' => 'idvaloresimagenes', 'foreign' => 'idvaloresimagenes'));
    }

    public function Buscar($idevalescalavaloreimagene) {
        $temp = $this->conn->getTable('DatEvalescalavaloresimagen')->find($idevalescalavaloreimagene);
        return $temp->toArray();
    }

    function exiteImagenInEscala($idvaloresimagenes, $idescala) {
         $queryObj = Doctrine_Query::create()
            ->select('idevalescalavaloreimagene')
            ->from('DatEvalescalavaloresimagen')
            ->where('idescala = ? and idvaloresimagenes = ?', array($idescala, $idvaloresimagenes));
         return $queryObj->fetchArray();
    }

    public function obtenerEscalaValorImagen($idevalescalavaloreimagene) {
        return $DatMetadato = Doctrine::getTable('DatEvalescalavaloresimagen')->find($idevalescalavaloreimagene);
    }

//Devuelve la cantidad de valores de imagen por escala
    public function cantValorImagenXEscala($idescala) {
        $query = new Doctrine_Query ();
        $result = $query->select('COUNT(vi.idescala) as cantidad')
                ->from('DatEvalescalavaloresimagen vi')
                ->where('vi.idescala = ?', $idescala)
                ->execute();
        return $result[0]['cantidad'];
    }

    public function GetTodos() {
        $query = new Doctrine_Query ();
        $result = $query->from('DatEvalescalavaloresimagen')->execute();
        return $result->toArray();
    }

    public function GetPorLimite($limite = 100, $inicio = 0) {
        $query = new Doctrine_Query ();
        $result = $query->from('DatEvalescalavaloresimagen')->limit($limite = 100)->offset($inicio = 0)->execute();
        return $result->toArray();
    }

    public function GetValoresPorEscala($idescala) {
        $result = array();
        $dirimgs = "../../../plantillas/nomvalimgs/";
        $query = Doctrine_Manager::getInstance();
        $sql = "SELECT evi.idevalescalavaloreimagene,vi.denom,vi.descripcion,vi.extension,vi.idvaloresimagenes
					FROM mod_evaluaciones.dat_evalescalavaloresimagen evi
					INNER JOIN mod_evaluaciones.nom_evalvaloresimagenes vi ON (evi.idvaloresimagenes = vi.idvaloresimagenes)
					WHERE evi.idescala = '$idescala'";
        $arrEscalaVI = $query->getCurrentConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);

        foreach ($arrEscalaVI as $imagen) {
            $result[] = array('idevalescalavaloreimagene' => $imagen['idevalescalavaloreimagene'], 'imagen' => $dirimgs . '' . $imagen['idvaloresimagenes'] . $imagen['extension'], 'descripcion' => $imagen['descripcion']);
        }

        return $result;
    }

}