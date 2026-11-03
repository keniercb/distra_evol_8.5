<?php

/**
 * @name DatServAlimentacionModel - Clase de logica de negocio para los servicios de alimentacion
 * @package   personaext
 * @copyright XETID.
 * @author    Centro RRHH. División Gestión de Entidades. XETID.
 * @version   1.0
 */
class DatServalimentacionModel extends ZendExt_Model implements IConceptoExport
{
    /**
     * Contructor de la clase
     */
    public function init()
    {
        parent::ZendExt_Model();
    }

    /**
     * @method obtenerEventosAlimentacion - Devuelve los eventos de alimentacion.
     * @return Array - Arreglo con los eventos de alimentacion.
     * @author Orestes Rodríguez Lorenzo
     */
    public function obtenerEventosAlimentacion()
    {
        try {
            //Creando instancia de la clase modelo del nomenclador de servicios de alimentacion
            $objServ = new NomEventoalimentacionModel();
            //Obteniendo todos los eventos para los servicios de alimentacion
            $eventos = $objServ->obtenerEventoAlimentacion(null, null, null);
            //Creando arreglo a retornar
            $result = array();
            //Recorriendo el arreglo para seleccionar solo los valores que se usaran en la vista
            foreach ($eventos->data as $k => $v) {
                //Adicionando los valores seleccionados
                array_push($result, array('idevento' => $v['idevento'], 'evento' => $v['denominacion']));
            }

            return $result;
        } catch (Exception $e) {

        }
    }

    /**
     * @method obtenerEstAlimentacion - Devuelve las estructuras de alimentacion
     * @params $nodo - Nodo del arbol a partir del cual se desea cargar las estructuras
     * @return Array - Arreglo de estructuras.
     * @author Orestes Rodríguez Lorenzo
     */
    public function obtenerEstAlimentacion($nodo)
    {
        try {
            $datos = array();
            //Verificando si el nodo es la raiz del arbol.
            if ($nodo == 'root') {
                //Obteniendo el identificador de la estructura configurada para el concepto.
                $idestructura = ZendExt_IoC_Inter::getInstance()->maestro->obtenerConfEstructuraConcepto(1);
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
     * @method obtenerServAlimentacionPorPersona - Devuelve los servicios de alimetacion de la persona.
     * @params $idpersona - Identificador de la persona.
     * @return Array - Arreglo con los servicios de alimentacion de la persona.
     * @author Orestes Rodríguez Lorenzo
     */
    public function obtenerServAlimentacionPorPersona($idpersona,$evento,$pantry)
    {
        //Creando variable para retornar el resultado
        $result = new stdClass();
        try {
            $result->data = DatServalimentacion::obtenerServAlimentacionPorPersona($idpersona,$evento,$pantry);
         //   print_r($result->data);die;
            foreach ($result->data as $k => $v) {
                $estructura = ZendExt_IoC::getInstance()->metadatos->DameEstructura($v['idestructura']);
                $result->data[$k]['denominacion'] = $estructura[0]->denominacion;
            }
            $result->success = true;
//print_r($result);die;
            return $result;
        } catch (Exception $e) {
            $result->error = $e;

            return $result;
        }
    }

    /**
     *
     */
    public function adicionarServAlimentacion($idpersona, $arrServ)
    {
        foreach ($arrServ as $v) {
            $obj = new DatServalimentacion();
            $obj->idpersona = $idpersona;
            $obj->idestalimentacion = $v->idestalimentacion;
            $obj->idevento = $v->idevento;
            $obj->fdesde = $v->fdesde;
            $obj->fhasta = $v->fhasta;
            $obj->save();
        }
    }

    /**
     *
     */
    public function modificarServAlimentacion($idpersona, $arrServ)
    {
        foreach ($arrServ as $v) {
            $obj = DatServalimentacion::obtenerPorId($v->idservalimentacion);
            $obj->idpersona = $idpersona;
            $obj->idestalimentacion = $v->idestalimentacion;
            $obj->idevento = $v->idevento;
            $obj->fdesde = $v->fdesde;
            $obj->fhasta = (empty($v->fhasta)) ? null : $v->fhasta;
            $obj->save();
        }
    }

    /**
     *
     */
    public function eliminarServAlimentacion($arrServ)
    {
        foreach ($arrServ as $v) {
            $obj = DatServalimentacion::obtenerPorId($v);
            $obj->delete();
        }
    }

    public function concatDqlPersonaDataExport($query, $baseAlias)
    {
       // return $query->addSelect('serva.*')->leftJoin($baseAlias . '.DatServalimentacion serva');
        return $query;
    }
}