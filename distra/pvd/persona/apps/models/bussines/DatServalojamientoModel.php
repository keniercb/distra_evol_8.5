<?php

/**
 * @name DatServalojamientoModel - Clase de logica de negocio para los servicios de alojamiento
 * @package   personaext
 * @copyright XETID.
 * @author    Centro RRHH. División Gestión de Entidades. XETID.
 * @version   1.0
 */
class DatServalojamientoModel extends ZendExt_Model implements IConceptoExport
{
    /**
     * Contructor de la clase
     */
    public function init()
    {
        parent::ZendExt_Model();
    }

    /**
     * @method obtenerEstAlojamiento - Devuelve las estructuras de alojamiento
     * @params $nodo - Nodo del arbol a partir del cual se desea cargar las estructuras
     * @return Array - Arreglo de estructuras.
     * @author Orestes Rodríguez Lorenzo
     */
    public function obtenerEstAlojamiento($nodo)
    {
        try {
            $datos = array();
            //Verificando si el nodo es la raiz del arbol.
            if ($nodo == 'root') {
                //Obteniendo el identificador de la estructura configurada para el concepto.
                $idestructura = ZendExt_IoC_Inter::getInstance()->maestro->obtenerConfEstructuraConcepto(3);
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
     * @method obtenerServAlojPorPersona - Devuelve los servicios de alojamiento de la persona.
     * @params $idpersona - Identificador de la persona.
     * @return stdClass - Arreglo con los servicios de alojamiento de la persona.
     * @author Orestes Rodríguez Lorenzo
     */
    public function obtenerServAlojPorPersona($idpersona)
    {
      //  print_r($idpersona);die;
        //Creando variable para retornar el resultado
        $result = new stdClass();
        $objNomestructalojamientoModel=new NomestructalojamientoModel();
        $rut=[];
        try {
            $result->data = DatServalojamiento::obtenerServAlojPorPersona($idpersona);
           // print_r($result->data);die;
            foreach($result->data as $key => $val){
                $rutanodo=$objNomestructalojamientoModel->getRutaAlojamiento($val['idestructuraalojamiento'],$rut);
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
     * @method adicionarServAlojamiento - Funcion para adicionar servicios de alojamiento a una persona
     * @param $idpersona - Identificador de la persona
     * @param $arrServ - Arreglo de servicios a adicionar
     *
     * @author Orestes Rodríguez Lorenzo
     */
    public function adicionarServAlojamiento($idpersona, $arrServ)
    {
        foreach ($arrServ as $v) {
            $obj = new DatServalojamiento();
            $obj->idpersona = $idpersona;
            $obj->idestructuraalojamiento = $v->idestructuraalojamiento;
            $obj->fdesde = $v->fdesde;
            $obj->fhasta = $v->fhasta;
            $obj->save();
        }
    }

    /**
     * @method modificarServAlojamiento - Funcion para modificar los servicios de alojamiento a una persona
     * @param $idpersona - Identificador de la persona.
     * @param $arrServ - Arreglo de servicios a modificar
     *
     * @author Orestes Rodríguez Lorenzo
     */
    public function modificarServAlojamiento($idpersona, $arrServ)
    {
        foreach ($arrServ as $v) {
            $obj = DatServalojamiento::obtenerPorId($v->idservalojamiento);
            $obj->idpersona = $idpersona;
            $obj->idestructuraalojamiento = $v->idestructuraalojamiento;
            $obj->fdesde = $v->fdesde;
            $obj->fhasta = (empty($v->fhasta)) ? null : $v->fhasta;
            $obj->save();
        }
    }

    /**
     * @method eliminarServAlojamiento - Funcion para eliminar los servicios de alojamiento de una persona
     * @param $arrServ - Arreglo con los identificadores de servicios a eliminar
     *
     * @author Orestes Rodríguez Lorenzo
     */
    public function eliminarServAlojamiento($arrServ)
    {
        foreach ($arrServ as $v) {
            $obj = DatServalojamiento::obtenerPorId($v);
            $obj->delete();
        }
    }

    public function concatDqlPersonaDataExport($query, $baseAlias)
    {
        return $query;
        //return $query->addSelect('dsaloj.*')->leftJoin($baseAlias.'.DatServalojamiento dsaloj');
    }
}