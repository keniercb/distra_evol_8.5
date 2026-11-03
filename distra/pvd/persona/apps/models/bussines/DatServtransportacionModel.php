<?php

/**
 * @name DatServtransportacionModel - Clase de logica de negocio para los servicios de transportacion
 * @package   personaext
 * @copyright XETID.
 * @author    Centro RRHH. División Gestión de Entidades. XETID.
 * @version   1.0
 */
class DatServtransportacionModel extends ZendExt_Model implements IConceptoExport
{
    /**
     * Contructor de la clase
     */
    public function init()
    {
        parent::ZendExt_Model();
    }

    /**
     * @method obtenerEstTransporte - Devuelve las estructuras de transporte
     * @params $nodo - Nodo del arbol a partir del cual se desea cargar las estructuras
     * @return Array - Arreglo de estructuras.
     * @author Orestes Rodríguez Lorenzo
     */
    public function obtenerEstTransporte($nodo)
    {
        try {
            $datos = array();
            //Verificando si el nodo es la raiz del arbol.
            if ($nodo == 'root') {
                //Obteniendo el identificador de la estructura configurada para el concepto.
                $idestructura = ZendExt_IoC_Inter::getInstance()->maestro->obtenerConfEstructuraConcepto(2);
                //Retornando arreglo de estructuras
                $datos = ZendExt_IoC::getInstance()->metadatos->DameHijosEstructura($idestructura);
            } else {
                //Retornando arreglo de estructuras
                $datos = ZendExt_IoC::getInstance()->metadatos->DameHijosEstructura($nodo);
            }
            foreach ($datos as $k => $d) {
                $datos[$k]->idpadre = $d->_parent;
            }

            return $datos;
        } catch (Exception $e) {
            return array();
        }
    }

    /**
     * @method obtenerSerTranspPorPersona - Devuelve los servicios de alimetacion de la persona.
     * @params $idpersona - Identificador de la persona.
     * @return stdClass - Arreglo con los servicios de alimentacion de la persona.
     * @author Orestes Rodríguez Lorenzo
     */
    public function obtenerServTranspPorPersona($idpersona, $ruta)
    {
        //Creando variable para retornar el resultado
        $result = new stdClass();
        $rut=[];
        $objNomEstructransportacionModel=new NomEstructransportacionModel();
        try {
            $result->data = DatServtransportacion::obtenerServTranspPorPersona($idpersona, $ruta);
            foreach($result->data as $key => $val){
                $rutanodo=$objNomEstructransportacionModel->getRutaTransportacion($val['idestructuratransportacion'],$rut);
                $result->data[$key]['ruta']=implode('->',$rutanodo);
            }
            $result->success = true;

            return $result;
        } catch (Exception $e) {
            $result->error = $e;

            return $result;
        }
    }


    /**
     * @method adicionarServTransportacion - Funcion para adicionar servicios de transportacion a una persona
     * @param $idpersona - Identificador de la persona
     * @param $arrServ - Arreglo de servicios a adicionar
     *
     * @author Orestes Rodríguez Lorenzo
     */
    public function adicionarServTransportacion($idpersona, $arrServ)
    {
        foreach ($arrServ as $v) {
            $obj = new DatServtransportacion();
            $obj->idpersona = $idpersona;
            $obj->idestructuratransportacion = $v->idestructuratransportacion;
            $obj->fdesde = $v->fdesde;
            $obj->fhasta = $v->fhasta;
            $obj->save();
        }
    }

    /**
     * @method modificarServTransportacion Funcion para modificar los servicios de transportacion a una persona
     * @param $idpersona - Identificador de la persona.
     * @param $arrServ - Arreglo de servicios a modificar
     *
     * @author Orestes Rodríguez Lorenzo
     */
    public function modificarServTransportacion($idpersona, $arrServ)
    {
        foreach ($arrServ as $v) {
            $obj = DatServtransportacion::obtenerPorId($v->idservtransportacion);
            $obj->idpersona = $idpersona;
            $obj->idestructuratransportacion = $v->idestructuratransportacion;
            $obj->fdesde = $v->fdesde;
            $obj->fhasta = (empty($v->fhasta)) ? null : $v->fhasta;
            $obj->save();
        }
    }

    /**
     * @method eliminarServTransportacion - Funcion para eliminar los servicios de transportacion de una persona
     * @param $arrServ - Arreglo con los identificadores de servicios a eliminar
     *
     * @author Orestes Rodríguez Lorenzo
     */
    public function eliminarServTransportacion($arrServ)
    {
        foreach ($arrServ as $v) {
            $obj = DatServtransportacion::obtenerPorId($v);
            $obj->delete();
        }
    }

    public function concatDqlPersonaDataExport($query, $baseAlias)
    {
        return $query;
        //return $query->addSelect('dstrans.*')->leftJoin($baseAlias.'.DatServtransportacion dstrans');
    }
}