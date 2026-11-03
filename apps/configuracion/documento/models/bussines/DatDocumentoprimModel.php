<?php

/**
 * Clase modelo para datos de documentos primarios.
 *
 * @author     Ing. Maikel Garcia Valdes.
 * @package    Configuración
 * @subpackage Documento/Models/Bussines
 * @copyright  XETID.
 * @version    1.0-0
 */
class DatDocumentoprimModel extends ZendExt_Model
{
    private $_confdoc;
    /**
     * Constructor de la clase
     */
    public function __construct()
    {
        $this->_confdoc = new ConfDocumentoprim();
        parent::ZendExt_Model();
    }

    /**
     * Adiciona datos de documento primario
     *
     * @param mixed $objeto Objeto a adicionar
     *
     * @return boolean True si adicionó correctamente
     * @throws ZendExt_Exception
     */
    public function insertarDatDocumentoprim(&$objeto)
    {
        try {
            $doc = DatDocumentoprim::BuscarDocumentoParam(
                array('idestructurasubsist' => $objeto->idestructurasubsist, 'sigla' => $objeto->sigla)
            );
            //$objDocPrim = $objeto->BuscarDocumentoParam(array('sigla' => $sigla,
            //'idestructurasubsist' => $idestructurasubsist));
            //if (count($objDocPrim) == 0) {
            //return true;
            //} else {
            //return false;
            //}
            $res = DatDocumentoprim::buscarPorIdDocEstructura($objeto->iddocumentos, $objeto->idestructurasubsist);
            if (empty($res) && empty($doc)) {
                $objeto->save();
                return true;
            } else {
                return false;
            }
        } catch (Doctrine_Exception $ee) {
            throw new ZendExt_Exception('CONF144', $ee);
        }
    }

    /**
     * Elimina datos de documento primario
     *
     * @param mixed $obj Objeto a eliminar
     *
     * @return boolean True si eliminó correctamente
     * @throws ZendExt_Exception
     */
    public function eliminarDatDocumentoprim($obj)
    {
//        try {
//            $dm = Doctrine_Manager::getInstance();
//            $cc = $dm->getCurrentConnection();
//            $cc->beginTransaction();
//            $obj->delete();
//            $cc->commit();
//            return true;
//        } catch (Doctrine_Exception $ee) {
//            if ($ee->getCode() == 23503) {
//                return '-4';
//            }
//            else{
//            throw new ZendExt_Exception('NOTCONTROLLED', $ee);
//            }
        //}
        try {
            $objDoctrine = Doctrine_Manager::getInstance();
            $conexionActual = $objDoctrine->getCurrentConnection();
            $conexionActual->fetchAll(
                "DELETE FROM mod_datosmaestros.dat_documentoprim doc WHERE $obj->iddoc = doc.iddoc;"
            );

            return true;
        } catch (Doctrine_Exception $ee) {
            return '-4';
            //throw new ZendExt_Exception('CONF002', $ee);
        }
    }

    //-----------------------------------------------------modificar operacion--------------------------------------
//    public function modificarDatDocumentoprim(&$obj) {
    /**
     * Modifica datos de documento primario
     *
     * @param DatDocumentoprim $objeto Objeto a modificar
     *
     * @return boolean True si modificó correctamente
     * @throws ZendExt_Exception
     */
    public function modificarDatDocumentoprim(DatDocumentoprim $obj)
    {
        try {
            $iddoc = $obj->iddoc;
            $idestructurasubsist = $obj->idestructurasubsist;
            $sigla = $obj->sigla;
            $valid = true;

            $doc = DatDocumentoprim::BuscarDocumentoParam(
                array('idestructurasubsist' => $idestructurasubsist, 'sigla' => $sigla)
            );
            if (!empty($doc) && count($doc) == 1 && $iddoc != $doc[0]['iddoc']) {
                $valid = false;
            }
            if ($valid) {
                $obj = new DatDocumentoprim();
                $obj = Doctrine::getTable('DatDocumentoprim')->find($iddoc);
                $obj->iddoc = $iddoc;
                $obj->sigla = $sigla;
                $obj->save();
                return true;
            } else {
                return false;
            }
        } catch (Doctrine_Exception $ee) {
            throw new ZendExt_Exception('CONF143', $ee);
        }
    }

    /**
     * Obtiene la cantidad de documentos primarios
     *
     * @param mixed $idEstructura Identificador de estructura común
     *
     * @return int Cantidad de documentos
     */
    public function cantidadDocumentoPrimarioIn($idEstructura)
    {

        $query = Doctrine_Query::create();
        $cantFndes = $query->select('count(u.iddoc) as cant')
            ->from('DatDocumentoprim u')
            ->where("u.idestructurasubsist ='$idEstructura'")
            ->execute();
        return $cantFndes[0]->cant;
    }

    /**
     * Guarda los documentos configurados para la entidad actual como una plantilla
     * para ser usados posteriormente por otra entidad
     *
     * @param array $request Arreglo con los datos que vienen por post
     *
     * @return mixed Arreglo con los datos de errores o si todo fue satisfactorio.
     */
    public function crearPlantilla($request)
    {
        try {
            $instance = Doctrine_Manager::getInstance();
            $conexion = $instance->getCurrentConnection();
            $request['conexion'] = $conexion;
            $result = $this->integrator->datosmaestros->insertarPlantilla($request);
            $idestructura = $request['idestructura'];
            $idestructura = ($idestructura) ? $idestructura : $this->global->Estructura->idestructura;
            $documentos = DatDocumentoprim::GetDocsPrimByEstructura($idestructura);
            if ($result['id']) {
                foreach ($documentos as $row) {
                    $conf = new ConfDocumentoprim();
                    $conf->idsubsistema = $row['idsubsistema'];
                    $conf->iddocumentos = $row['iddocumentos'];
                    $conf->sigla = $row['sigla'];
                    $conf->numinicial = $row['numinicial'];
                    $conf->idgestordocumental = $result['idgestordocumental'];
                    $conf->idespaciotrabajo = $result['idespaciotrabajo'];
                    $conf->idplantilla = $result['id'];
                    $conf->save();
                }
            }
            return array('code' => 1, 'msg' => '');
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * Obtiene la información de una platilla determinada y la inserta para la entidad
     * actual
     *
     * @param array $request Arreglo con los datos que vienen por post
     *
     * @return mixed Arreglo con los datos de errores o si todo fue satisfactorio.
     */
    public function usarPlantilla($request)
    {
        try {
            $idplantilla = $request['idplantilla'];
            $idestructura = $request['idestructura'];
            $idestructura = ($idestructura) ? $idestructura : $this->global->Estructura->idestructura;
            if ($idplantilla) {
                $documentos = $this->_confdoc->getDocumentos($idplantilla,$idestructura);
                if (count($documentos)) {
                    DatDocumentoprim::EraseByEstrucutura($idestructura);
                }
                foreach ($documentos as $row) {
                    $instance = new DatDocumentoprim();
                    $instance->iddocumentos = $row['iddocumentos'];
                    $instance->sigla = $row['sigla'];
                    $instance->idestructurasubsist = $row['idestructurasubsist'];
                    $instance->numinicial = $row['numinicial'];
                    $instance->idgestordocumental = $row['idgestordocumental'];
                    $instance->idespaciotrabajo = $row['idespaciotrabajo'];
                    $instance->save();
                }
            }
            return array('code' => 1, 'msg' => '');
        } catch (Doctrine_Exception $e) {
            return array('code' => $e->getCode(), 'msg' => $e->getMessage());
        }
    }

    /**
     * Lista las plantillas creadas para este componente
     *
     * @param array $request Arreglo con los datos que vienen por post
     *
     * @return mixed Arreglo con las plantillas disponibles
     */
    public function listarPlantillas($request)
    {
        return $this->integrator->datosmaestros->listarPlantillas($request);
    }

}
