<?php
/**
 * Created by PhpStorm.
 * User: yari
 * Date: 26/10/2017
 * Time: 11:18
 */

class CompetenciaService extends ZendExt_Model
{

    public function getCompetenciaByPersonaCargo($idcargo, $idpersona)
    {
        $objModel = new DatCompetenciaModel();
        return $objModel->getCompetenciaByPersonaCargo($idcargo, $idpersona);
    }
}