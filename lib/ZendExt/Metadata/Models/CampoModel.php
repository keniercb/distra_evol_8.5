<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of CampoModel
 *
 * @author zcool
 */
class ZendExt_Metadata_Models_CampoModel extends ZendExt_Model
{

    private $_manager;
    private $_campo_domain;
    private $_module;

    public function __construct()
    {
        parent:: ZendExt_Model();
        $this->_manager = new ZendExt_Metadata_Sql_Manager ();
        $this->_campo_domain = new DatCampo();
        $this->_tabla_domain = new DatTabla();

        $doctrineManager = Doctrine_Manager::getInstance();
        $this->_module = $doctrineManager->getConnectionName($this->conn);
    }

    public function cargarCampos($idtabla)
    {
        $this->_manager->setCurrentConnection('xmetacomponent');
        $data = new stdClass();
        $data->data = $this->_campo_domain->cargarCampos($idtabla);

        $data->total = sizeof($data->data);
        $this->_manager->setCurrentConnection($this->_module);
        return $data;
    }

    function cargarTiposDatos()
    {
        $this->_manager->setCurrentConnection('xmetacomponent');

        $q = Doctrine_Query:: create();
        $result = $q->from('NomTipoDato td')->orderBy('idtipodato', 'ASC')->execute()->toArray();

        $this->_manager->setCurrentConnection($this->_module);
        return $result;
    }

    function eliminarCampo($idcampo, $flag = false)
    {
        $this->_manager->setCurrentConnection('xmetacomponent');
        $field = Doctrine:: getTable('DatCampo')->find($idcampo);
        if ($field && $field->DatComponente->idtipocomponente) {
            if ($field->DatComponente->idtipocomponente == 5) {

               $tab =  Doctrine::getTable('DatRemoto')->find($field->DatComponente->idcomponente)/*->delete()*/;
                if($tab)
                    $tab->delete();

            }

            $tabla = $field->DatComponente->NomTipoComponente->tabla;
            Doctrine:: getTable($tabla)->find($field->DatComponente->idcomponente)->delete();
        }

        if (!empty($field->Origen)) {
            $field->Origen->delete();
        }

        if (!empty($field->Destino)) {
            $field->Destino->delete();
        }

        if ($field) {
            $field->delete();
        }

        if (!$flag && $field) {
            $this->_manager->eliminarCampo($field);
        }

        $this->_manager->setCurrentConnection($this->_module);
        return true;
    }

    public function adicionarDisplayField($idtabla, $idcampo)
    {
        $this->_manager->setCurrentConnection('xmetacomponent');
        $displayfield = new DatDisplayfield();
        $displayfield->idtabla = $idtabla;
        $displayfield->idcampo = $idcampo;
        $displayfield->save();
        $this->_manager->setCurrentConnection($this->_module);
        return true;
    }

    private function adicionarComponente($pCampo, $pIdTipoComponente, $configcmp)
    {

        $tabla = Doctrine:: getTable('NomTipoComponente')->find($pIdTipoComponente)->tabla;

        if ($tabla) {
            $tipocomponente = new $tabla ();
            $fields = array_keys($tipocomponente->getData());

            foreach ($fields as $field) {
                if ($configcmp[$field]) {
                    $tipocomponente->$field = $configcmp[$field];
                }
            }

            $tipocomponente->idcampo = $pCampo->idcampo;
            $tipocomponente->idtipocomponente = $pIdTipoComponente;
            $tipocomponente->orden = DatCampo::obtenerUltimoOrden($pCampo->idtabla);
            $tipocomponente->save();
            return $tipocomponente;
        }

        return null;
    }

    function adicionarCampo(
        $denominacion, $idtabla, $tipodato, $permite_nulo, $longitud = 0, $configcmp = array(), $llave_primaria = 0,
        $secuencia = 0, $componente = true
    )
    {
        $count = 0;
        $this->_manager->setCurrentConnection('xmetacomponent');

        $table = Doctrine:: getTable('DatTabla')->find($idtabla);

        if ($count == 0) {
            if (DatCampo:: existeCampo($idtabla, $denominacion) == 0) {
                switch ($tipodato) {
                    case 1: {
                        $idtipocomponente = 1;
                        break;
                    }
                    case 2: {
                        $idtipocomponente = 4;
                        break;
                    }
                    case 3: {
                        $idtipocomponente = 3;
                        break;
                    }
                    case 4: {
                        $idtipocomponente = 2;
                        $longitud = 1;
                        break;
                    }
                    case 5: {
                        $idtipocomponente = 5;
                        $longitud = 19;
                        break;
                    }
                    case 6: {
                        $idtipocomponente = 6;
                        break;
                    }
                    default:
                        $idtipocomponente = 0;
                }

                $module_name = Zend_Registry:: get('config')->module_name;

                $config = Zend_Registry:: get('config')->bd->$module_name;
                $gestor = $config->gestor;

                $idtipodatogestor = $this->_campo_domain->getTipoDatoGestor($tipodato, $gestor);

                $campo = new DatCampo();
                $campo->denominacion = strtolower($denominacion);
                $campo->llaveprimaria = $llave_primaria;
                $campo->secuencia = $secuencia;
                $campo->permitenulo = $permite_nulo;
                $campo->longitud = $longitud;
                $campo->idtabla = $idtabla;
                $campo->idtipodatogestor = $idtipodatogestor;


                $q = Doctrine_Query:: create();
                $tipodatogestor = $q->from('NomTipoDatoNomGestor tdg, tdg.NomTipoDato td, tdg.NomGestor g')
                    ->select('tdg.idtipodatogestor, td.denominacion, g.denominacion')
                    ->where('tdg.idtipodatogestor = ?', $idtipodatogestor)
                    ->execute()->getFirst();

                $this->_manager->adicionarCampo(
                    $table, $denominacion, $tipodatogestor->nombre, $longitud, $permite_nulo, $secuencia,
                    $llave_primaria, $configcmp['precision']
                );
                if ($llave_primaria) {
                    $this->_manager->ponerNoNulo($campo);
                    $this->_manager->adicionarCampoALaLlavePrimaria($campo);
                }

                $campo->save();
                //print_r(array('pn'=>$permite_nulo, 'campo'=>$campo));die;
                if (!$permite_nulo) {
                    $this->_manager->ponerNoNulo($campo);
                }


                if ($componente) {
                    $idcomponente = $this->adicionarComponente($campo, $idtipocomponente, $configcmp);
                } else {
                    $idcomponente = 0;
                }

                if ($idtipocomponente == 5) {
                    $this->crearComponenteNomenclador($configcmp, $campo, $idcomponente);
                }

                $this->_manager->setCurrentConnection($this->_module);
                return $campo;
            } else {
                throw new ZendExt_Exception('XMT005');
            }
        } else {
            throw new ZendExt_Exception('XMT003');
        }
    }

    public function cargarCamposTabla($idtabla)
    {
        $this->_manager->setCurrentConnection('xmetacomponent');
        $tabla = Doctrine::getTable('DatTabla')->find($idtabla);

        if ($tabla['importada'] != 0) {
            $key = $this->obtenerPrimaryKeyDadoIdtabla($idtabla);
            $arrfields[] = array('idcampo' => $key->idcampo, 'denominacion' => $key->denominacion,
                'llave_primaria' => 1);
            $fields = $this->_manager->obtenerCamposDeTabla($tabla->esquema, $tabla->tabla);
            foreach ($fields as $campos) {
                if ($campos['column_name'] != $key->denominacion) {
                    $arrfields[] = array('idcampo' => '', 'denominacion' => $campos['column_name'],
                        'llave_primaria' => 0);
                }
            }
        } else {
            $arrfields = DatCampo::cargarCmbCampos($tabla['idtabla']);
        }

        $this->_manager->setCurrentConnection($this->_module);
        return $arrfields;
    }

    public function obtenerLlavePrimaria($esquema, $tabla)
    {
        $this->_manager->setCurrentConnection('xmetacomponent');
        $table = $this->_tabla_domain->existeTabla($esquema, $tabla);
        $primaryKey = array();
        if ($table) {
            $primary = $this->_manager->obtenerPrimaryKeyDeTabla($esquema, $tabla);
            $primaryKey = array('denominacion' => $primary[0]['column_name'], 'llave_primaria' => 1);
        }
        $this->_manager->setCurrentConnection($this->_module);
        return $primaryKey;
    }

    private function crearComponenteNomenclador($configcmp, $campo, $idcomponente)
    {
        $idcampovf = $configcmp['idcampovf'];

        $relationModel = new ZendExt_Metadata_Models_RelacionModel();
        $relationModel->crearRelacion($idcampovf, $campo->idcampo, 1, 1);

        $remoto = new DatRemoto();
        $remoto->idcomponente = $idcomponente->idcomponente;
        $remoto->campodenominacion = $configcmp['idcampodf'];
        $remoto->campoorigen = $idcampovf;
        $remoto->campodestino = $campo->idcampo;
        $remoto->save();
        $this->_manager->setCurrentConnection($this->_module);
        return $remoto;
    }

    public function cargarExpresionesRegulares()
    {
        $this->_manager->setCurrentConnection('xmetacomponent');

        $q = Doctrine_Query:: create();
        $result = $q->from('NomExpresionRegular er')->execute()->toArray();

        $this->_manager->setCurrentConnection($this->_module);
        return $result;
    }

    public function ordenarCampos($arrOrden)
    {
        for ($i = 0; $i < count($arrOrden); $i++) {
            $componente = Doctrine::getTable('DatComponente')->find($arrOrden[$i]);
            $componente->orden = $i + 1;
            $componente->save();
        }

        return true;
    }

    public function obtenerCamposConRepresentacion($idtabla)
    {
        $this->_manager->setCurrentConnection('xmetacomponent');
        $fields = $this->_campo_domain->obtenerCamposConRepresentacion($idtabla);
        $this->_manager->setCurrentConnection($this->_module);
        return $fields;
    }

    public function obtenerPrimaryKeyDadoIdtabla($idtabla)
    {
        $this->_manager->setCurrentConnection('xmetacomponent');
        $key = $this->_campo_domain->obtenerLLavePrimaria($idtabla);
        $this->_manager->setCurrentConnection($this->_module);
        return $key;
    }

    public function obtenerDisplayFieldDadoIdtabla($idtabla)
    {
        $this->_manager->setCurrentConnection('xmetacomponent');
        $displayfield = $this->_campo_domain->obtenerDisplayField($idtabla);
        $this->_manager->setCurrentConnection($this->_module);
        return $displayfield;
    }

    public function existeCampoEnTabla($idtabla, $denominacion)
    {
        $this->_manager->setCurrentConnection('xmetacomponent');
        return DatCampo:: existeCampo($idtabla, $denominacion);
    }


}
