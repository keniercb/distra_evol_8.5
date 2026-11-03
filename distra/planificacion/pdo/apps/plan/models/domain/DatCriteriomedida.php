<?php

/**
 * @author    Liermes Ferriol Mena
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class DatCriteriomedida extends BaseDatCriteriomedida
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatObjetivo',
            array('local' => 'idobjetivo', 'foreign' => 'idobjetivo')
        );
        $this->hasMany(
            'DatCriterioDatInvolucrados', array('local'   => 'idcriteriomedida',
                                                'foreign' => 'idcriteriomedida')
        );
        $this->hasMany(
            'DatFormulaindicador', array('local'   => 'idcriteriomedida',
                                                'foreign' => 'idcriteriomedida')
        );
    }

    public function Buscar($idcriteriomedida)
    {
        $temp = Doctrine::getTable('DatCriteriomedida')->find(
            $idcriteriomedida
        );
        return $temp;
    }

    public function GetTodos()
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatCriteriomedida')
            ->execute();
        return $result->toArray();
    }

    public function GetPorLimite($limite = 10, $inicio = 0)
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatCriteriomedida')
            ->limit($limite = 10)
            ->offset($inicio = 0)
            ->execute();
        return $result->toArray();
    }

    public function GetCritDadoIdElemen($idElemento)
    {
        $query = new Doctrine_Query();
        $result = $query->from("DatCriteriomedida cm")
            ->where("cm.idobjetivo = $idElemento")
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();

        return $result;
    }

    public function ObtenerCriteriosByOvjetivo($idobjetivo)
    {
        $query = new Doctrine_Query();
        $result = $query->from("DatCriteriomedida cm")
            ->where("cm.idobjetivo = $idobjetivo")
            ->execute();
        return $result->toArray();
    }

    public function existeNomencladorSegunId($idNom)
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatCriteriomedida c ')
            ->where("c.idumedida = $idNom")
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $result;
    }

    public function GetCriteriosIguales($idobjetivo, $dencriterio)
    {
        $query = new Doctrine_Query();
        $result = $query->from("DatCriteriomedida cm")
            ->where(
                "cm.idobjetivo = '$idobjetivo' 
                    AND cm.dencriterio = '$dencriterio'"
            )
            ->execute();
        return $result->toArray();
    }

    public function ObtenerCriteriosporInvolucrados(
        $idobjetivo, $arrayinvolcriterio
    ) {
        $conn = Doctrine_Manager:: connection();
        $cadenainvol = '';
        if (isset($arrayinvolcriterio[0])) {
            $cadenainvol .= " AND (";
            $totalinvol = count($arrayinvolcriterio);
            $operator = " OR ";
            foreach ($arrayinvolcriterio as $key => $invol) {
                $llaveinvolucrado = $invol['llaveinvolucrado'];
                if ($key == $totalinvol - 1) {
                    $operator = " ";
                }
                $cadenainvol .= " (ci.llaveinvolucrado = '$llaveinvolucrado') "
                    . $operator;
            }
            $cadenainvol .= ") ";
        }
        $query
            = "SELECT c.idcriteriomedida, c.idumedida, c.idestadocump,
            c.dencriterio,c.fechainicio, c.fechafin, c.valormeta,c.valoreal,
            c.participante,c.descriterio,c.gradocumplimiento,
            c.estadocumplimiento
            FROM mod_objetivos.dat_criteriomedida c
            INNER JOIN mod_objetivos.dat_criteriomedida_dat_involucrados ci 
            ON ci.idcriteriomedida = c.idcriteriomedida
            WHERE c.idobjetivo = '$idobjetivo' " . $cadenainvol;
        $res = $conn->execute($query);
        $criterios = $res->fetchAll();
        return $criterios;
    }

    public function ObtenerCriteriosExistentes($arrayCriterios)
    {
        $query = new Doctrine_Query();
        $result = $query->select('dcm.idcriteriomedida')->from(
            'DatCriteriomedida dcm'
        )->whereIn("dcm.idcriteriomedida", $arrayCriterios)->execute();
        return $result->toArray();
    }

    public function ActualizarInfCriterioM()
    {
        $conn = Doctrine_Manager:: connection();
        $array = $this->getData();
        $idcriteriomedida = $array['idcriteriomedida'];
        $query = "UPDATE mod_objetivos.dat_criteriomedida SET ";
        foreach ($array as $key => $value) {
            if (strlen((string)$value) > 0) {
                $definicion = $this->getTable()->getColumnDefinition($key);
                if ($definicion['type'] != 'numeric') {
                    $value = "'" . (string)$value . "'";
                }
                $query = $query . " $key = $value,";
            }
        }
        $query = substr($query, 0, strlen($query) - 1);
        $query = $query . " WHERE idcriteriomedida = " . $idcriteriomedida;
        $conn->execute($query);
    }

    public function  ObtenerUnidadMedida($idunidadmedida)
    {
        $cadenaSelect = " SELECT * ";
        $cadenaQUERY  = " FROM mod_datosmaestros.nom_unidadmedida
        WHERE idunidadmedida  = {$idunidadmedida} ";
        $conn = Doctrine_Manager::connection();

        $result = $conn->execute($cadenaSelect . $cadenaQUERY)->fetchAll(
            PDO::FETCH_ASSOC
        );
        return $result;
    }

	/**
     * @param array $listadoId Arreglo de objetivos o de criterios de medida
     * @param text $campo Nombre del campo por el que se filtra (idobjetivo o idcriteriomedida)
     * @param int $porciento Porciento de cumplimiento del criterio de medida (0 - 100)
     * @param text $estado Estado del criterio de medida (Cumplido, Sin cumplir, Parcialmente cumplido)
     * @return Doctrine_Collection
     * @author Drisis Silvia Diaz Rodriguez
     * @created 28/05/2018
     */
    public static function actualizarPorcientoCM($listadoId, $campo, $porciento, $estado){

        return Doctrine_Query::create()->update('DatCriteriomedida')
            ->set("valoreal", "valormeta * ? / 100", $porciento)
            ->set("gradocumplimiento", "?", $porciento)
            ->set("estadocumplimiento",'?', $estado)
            ->whereIn($campo, $listadoId)
            //->getSqlQuery();
            ->execute();
	}
	
}

//fin clase 



