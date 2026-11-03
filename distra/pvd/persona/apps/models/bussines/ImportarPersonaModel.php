<?php
/******************************************************************************
 * Copyright (c) 2016. Todos los derechos reservados. RRHH-XETID              *
 ******************************************************************************/

include_once(Zend_Registry::get('config')->dir_aplication . '/pvd/comun/recursos/pclzip.lib.php');

class ImportarPersonaModel extends ZendExt_Model
{
    public function actualizarPersonaData($data)
    {
        foreach ($data as $value) {
            try {
                $objectModel = Doctrine::getTable('DatPersona')->find($value['idpersona']);
                $objectModel->synchronizeWithArray(json_decode($value['data'], true));
                $objectModel->save();
            } catch (Exception $e) {
                print_r($e->getMessage());
                die;
            }
        }
    }

    public function importarPersonaData($zipFile)
    {
        $personaExist = array();

        $tmpFileDir = Zend_Registry::get('config')->dir_aplication . 'pvd/persona/comun/recursos/' . $zipFile["name"];
        if (move_uploaded_file($zipFile["tmp_name"], $tmpFileDir)) {
            $archive = new PclZip($tmpFileDir);
            $personaExist = $this->loadPersonaData($archive->extract(PCLZIP_OPT_EXTRACT_AS_STRING));
            unlink($tmpFileDir);
        }

        return $personaExist;
    }

    private function loadPersonaData($files)
    {
        $personaInsert = array();
        $personaExist = array();

        foreach ($files as $val) {
            $personaData = json_decode($val['content'], true);
            $idpersona = $this->getPersonaId($personaData);
            if ($idpersona)
                array_push($personaExist, $this->formatValuesPersonaExist($idpersona, $personaData));
            else
                array_push($personaInsert, $personaData);
        }

        if (count($personaInsert))
            $this->insertPersona($personaInsert);

        return $personaExist;
    }

    private function formatValuesPersonaExist($idpersona, $data)
    {
        $docIdentPrinc = $this->getDocIdentidadPersonaPrincipal($data['DatDocidentidad']);

        return array(
            'idpersona' => $idpersona,
            'nombreyapellidos' => $data['nombre'] . ' ' . (($data['snombre']) ?
                    $data['snombre'] . ' ' : '') . $data['papel'] . ' ' . $data['sapel'],
            'noidentidad' => ($docIdentPrinc) ? $docIdentPrinc['numero'] : '',
            'data' => json_encode($data)
        );
    }

    private function insertPersona($personas)
    {
        try {
            $objectModel = new Doctrine_Collection('DatPersona');
            $objectModel->fromArray($personas);
            $objectModel->save();
        } catch (Exception $e) {
            print_r($e->getMessage());
            die;
        }
    }

    private function getPersonaId($personaData)
    {
//        $criterios = $this->pIntegrator->maestro->getCriteriosUnicidadPersona();
        $idpersona = 0;
        if (!empty($personaData['DatDocidentidad'])) {

            $docIdentidPrinc = $this->getDocIdentidadPersonaPrincipal($personaData['DatDocidentidad']);

            $person = Doctrine_Query::create()
                ->select('p.idpersona')
                ->from('DatPersona p')
                ->leftJoin('p.DatDocidentidad ddi')
                ->where('ddi.idtipodocidentidad = ? and ddi.numero = ? and principal = 1',
                    array($docIdentidPrinc['idtipodocidentidad'], $docIdentidPrinc['numero']))
                ->fetchOne(array(), Doctrine_Core::HYDRATE_ARRAY);

            if ($person)
                $idpersona = $person['idpersona'];
        }
        return $idpersona;
    }

    private function getDocIdentidadPersonaPrincipal($personaData)
    {
        $result = array();

        foreach ($personaData as $value) {
            if ($value['principal'] == 1)
                $result = $value;
        }

        return $result;
    }
}