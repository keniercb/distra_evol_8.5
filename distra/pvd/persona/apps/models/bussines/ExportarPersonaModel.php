<?php
/******************************************************************************
 * Copyright (c) 2016. Todos los derechos reservados. RRHH-XETID              *
 ******************************************************************************/

include_once(Zend_Registry::get('config')->dir_aplication . '/pvd/comun/recursos/zip_min.php');

class ExportarPersonaModel extends ZendExt_Model
{
    public function exportarPersonaData($idspersona, $idproyecto)
    {
        $data = $this->getDataExport($idspersona, $idproyecto);
     
        $zipfile = new zipfile();
        foreach ($data as $value) {
            $personaData = $this->formatPersonaData($value);
            $zipfile->addFile(json_encode($personaData), '' . $value['idpersona'] . '.json');
        }
        header("Content-type: application/octet-stream");
        header("Content-disposition: attachment; filename=personas.zip");
        echo $zipfile->file();
    }

    private function getDataExport($idspersona, $idproyecto)
    {
        $query = Doctrine_Query::create()->from('DatPersona p')->whereIn('p.idpersona', $idspersona);
        $concept = DatProyectoconcepto::getConceptosAutorizados($this->getUserRoles(), $idproyecto);
        foreach ($concept as $val) {
            $query = $this->concatDqlConceptoPersona($val['getdata'], $query);
        }

        return $query->execute();
    }

    private function getUserRoles()
    {
        $idusuario = $this->global->Perfil->idusuario;
        $arrRoles = $this->integrator->seguridad->getRolesbyUser($idusuario);
        $roles = array();
        foreach ($arrRoles as $v) {
            array_push($roles, $v['idrol']);
        }

        return $roles;
    }

    private function concatDqlConceptoPersona($config, $query)
    {
        if (!empty($config)) {
            $reflectClass = new ReflectionClass(json_decode($config)->class);
            if ($reflectClass->implementsInterface('IConceptoExport')) {
                $query = $reflectClass->newInstance()->concatDqlPersonaDataExport($query, 'p');
            }
        }

        return $query;
    }

    private function formatPersonaData($record)
    {
        $personData = $this->getRecordData($record);
        $references = $record->getReferences();
        foreach ($references as $key => $value) {
            if ($value->count()) {
                $personData[$key] = $this->getCollectionRecordData($value);
            }
        }

        //print_r($personData);die;
        return $personData;
    }

    private function getRecordData($record)
    {
        $result = $record->toArray(false);
        $keyNames = array_keys($record->identifier());
        foreach ($keyNames as $val) {
            unset($result[$val]);
        }
        //delete foreing persona
        unset($result['idpersona']);

        return $result;
    }

    private function getCollectionRecordData($collection)
    {
        $result = array();
        foreach ($collection as $val) {
            array_push($result, $this->getRecordData($val));
        }

        return $result;
    }
}