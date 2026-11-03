<?php

/**
 *
 *
 * @author         Ing. Lisvany Alonso Martinez
 * @package        ERP-PCRM
 * @subpackage     CRM/Clientes/Models/Bussines
 * @copyright (c)  2015, XETID
 * @version        1.0
 */
class SegmentacionModel extends ZendExt_Model
{
    /**
     * Constructor de la clase
     */
    public function __construct()
    {
        parent::ZendExt_Model();
    }

    public function addSegmentacion($addData)
    {//print_r($addData);die;
//        $addData = json_decode($addData);var_dump($addData);die;
        $this->delPerfil(array($addData));
        $idclienteproveedor = $addData['idclienteproveedor'];
        $cuestionario = json_decode($addData['arrayCuestionario'], true);
        foreach ($cuestionario as $c) {//print_r($c);die;
            $idcuestionario = $c['idcuestionario'];
            $editarcuestionario = $c['editarcuestionario'];
            $guardarcuestionariocomo = $c['guardarcuestionariocomo'];
            $newcuestionario = "'" . $c['newcuestionario'] . "'";
            $preguntaRespuesta = $c['preguntaRespuesta'];//print_r($preguntaRespuesta);die;
            list($addEx, $idcuestionario) = $this->cuestionario(
                $editarcuestionario, $guardarcuestionariocomo, $newcuestionario, $idcuestionario, array(),
                $preguntaRespuesta
            );
            foreach ($preguntaRespuesta as $pr) {//print_r($pr);die;
                $query = "INSERT INTO mod_crmperfil.dat_perfilcliente(idclienteproveedor, idcuestionario, idpregunta, idrespuesta)
                    VALUES ($idclienteproveedor, $idcuestionario, ".$pr['idpregunta'].", ".$pr['idrespuesta'].") RETURNING idclienteproveedor  ;";
                $ex = $this->executeQuery($query);
                if (!$ex) {
                    $addEx[] = array("addperfilcliente" => $pr->idpregunta);
                }
            }
        }

        if (empty($addEx)) {
            return array('success' => true);
        }

        return array('success' => false, $addEx);
    }

    public function upSegmentacion($upData)
    {
        return $this->addPerfil($upData);
    }

    public function delSegmentacion($delData)
    {//print_r(($delData));die;
        $delEx = array();
        foreach ($delData as $del) {//print_r($del);die;
            $query = "DELETE FROM mod_crmperfil.dat_perfilcliente
                        WHERE idclienteproveedor = ".$del['idclienteproveedor']." RETURNING idclienteproveedor  ;";
            $ex = $this->executeQuery($query);
            if (!$ex) {
                $delEx[] = $del->idperfilcliente;
            }
        }
        if (empty($delEx)) {
            return array('success' => true);
        }

        return array('success' => false, $delEx);
    }

    /**
     * @param $query
     *
     * @return string
     * @throws Doctrine_Connection_Exception
     */
    private function executeQuery($query)
    {
        try {
            $objDoctrine = Doctrine_Manager::getInstance();
            $conexionActual = $objDoctrine->getCurrentConnection();
            $statementCant = $conexionActual->execute($query);
            return $statementCant->fetchColumn(0);
        } catch (Exception $e) {
//            print_r($e);
            return false;
        }
    }

    /**
     * @param $editarcuestionario
     * @param $guardarcuestionariocomo
     * @param $newcuestionario
     * @param $addEx
     * @param $preguntaRespuesta
     *
     * @return array
     */
    private function cuestionario($editarcuestionario, $guardarcuestionariocomo, $newcuestionario, $idcuestionario,
        $addEx, $preguntaRespuesta
    ) {
        if ($editarcuestionario) {
            if ($guardarcuestionariocomo) {
                $query
                    = "INSERT INTO mod_crmperfil.nom_cuestionario(nombre)
                    VALUES ($newcuestionario) RETURNING idcuestionario ;";
                $ex = $this->executeQuery($query);
                if (!$ex) {
                    $addEx[] = array("addcuestionario" => $newcuestionario);
                } else {
                    $idcuestionario = $ex;
                }
            } else {
                $query
                    = "DELETE FROM mod_crmperfil.dat_cuestionariopregunta
                        WHERE idcuestionario = $idcuestionario RETURNING idcuestionario ;";
                /*$ex =*/ $this->executeQuery($query);
                /*if (!$ex) {
                    $addEx[] = array("delcuestionariopregunta" => $idcuestionario);
                }*/
            }
            foreach ($preguntaRespuesta as $p) {
                $query
                    = "INSERT INTO mod_crmperfil.dat_cuestionariopregunta(idcuestionario, idpregunta)
                    VALUES ($idcuestionario, ".$p['idpregunta'].") RETURNING idcuestionario ;";
                $ex = $this->executeQuery($query);
                if (!$ex) {
                    $addEx[] = array("addcuestionariopregunta" => $p->idpregunta);
                }
            }
            return array($addEx, $idcuestionario);
        }
        return array($addEx, $idcuestionario);
    }

}
