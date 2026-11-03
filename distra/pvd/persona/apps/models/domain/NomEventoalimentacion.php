<?php

class NomEventoalimentacion extends BaseNomEventoalimentacion
{
    /**
     * Constructor de la clase.
     */
    public function setUp()
    {
        parent::setUp();
    }

    /**
     * @method obtenerPorId - Devuelve el objeto dado el identificador
     * @param $idevento
     *
     * @return Doctrine_Record
     * @author Orestes Rodríguez Lorenzo
     */
    public function obtenerPorId($idevento)
    {
        return Doctrine::getTable('NomEventoalimentacion')->find($idevento);
    }

    /**
     * @method obtenerEventoAlimentacion - Devuelve la lista de eventos de alimentacion
     * @param $filtro - Filtro para establecer busquedas sobre los campos "denominacion" y "descripcion"
     * @param $limit - Limite de elementos a obtener en el bloque
     * @param $start - Inicio del bloque de elementos a obtener
     *
     * @return Array - Arreglo con los eventos de alimentacion
     * @throws Doctrine_Exception
     * @throws Exception
     * @author Orestes Rodríguez Lorenzo
     */
    public function obtenerEventoAlimentacion($filtro = null, $limit = null, $start = 0)
    {
        try {
            $query = Doctrine_Query::create()->select(
                'idevento, idevento as idnomenclador, denominacion, fdesde, fhasta, descripcion, abreviatura'
            )->from('NomEventoalimentacion')->where('fdesde <= now() and (now() <= fhasta or fhasta is null)')
                ->orderBy('denominacion');
            if ($limit) {
                $query->limit($limit)->offset($start);
            }
            else {
                $query->limit(15)->offset(0);
            }
            if ($filtro != null) {
                $query->andWhere("denominacion ilike '%$filtro%' or descripcion ilike '%$filtro%'");
            }

            return $query->execute()->toArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * @method cantEventoAlimentacion - Funcion para obtener la cantidad de eventos de alimentacion
     * @param $filtro - Filtro para establecer busquedas sobre los campos "denominacion" y "descripcion"
     *
     * @return Entero - Total de eventos de alimentacion que cumplen con las condiciones establecidas
     * @throws Doctrine_Exception
     * @throws Exception
     * @author Orestes Rodríguez Lorenzo
     */
    public function cantEventoAlimentacion($filtro = null)
    {
        try {
            $query = Doctrine_Query::create()->from('NomEventoalimentacion')->where(
                'fdesde <= now() and (now() <= fhasta or fhasta is null)'
            );
            if ($filtro != null) {
                $query->andWhere("denominacion ilike '%$filtro%'");
            }

            return $query->count();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * @method modificarEventoAlimentacion - Funcion para modificar un evento de alimentacion
     * @param $idevento - Identificador del evento de alimentacion
     * @param $denominacion - Denominacion del evento de alimentacion
     * @param $descripcion - Descripcion del evento de alimentacion
     * @param $fdesde - Fecha en que inicia la vigencia del evento de alimentacion
     * @param $fhasta - Fecha en que concluye la vigencia del evento de alimentacion
     *
     * @return bool - Respuesta positiva o negativa de la accion realizada
     * @author Orestes Rodríguez Lorenzo
     */
    public function modificarEventoAlimentacion($idevento, $denominacion, $descripcion, $fdesde, $fhasta)
    {
        try {
            $query = Doctrine_Query::create()->update('NomServalimentacion')->where('idevento= ? ', $idevento);
            if ($denominacion != '') {
                $query->set('denominacion', '?', $denominacion);
            }
            if ($descripcion != '') {
                $query->set('descripcion', '?', $descripcion);
            } else {
                $query->set('descripcion', 'null');
            }
            if ($fdesde != '') {
                $query->set('fdesde', '?', $fdesde);
            }
            if ($fhasta != '') {
                $query->set('fhasta', '?', $fhasta);
            } else {
                $query->set('fhasta', 'null');
            }
            $result = $query->execute();
            if ($result) {
                return true;
            } else {
                return false;
            }
        } catch (Exception $exc) {
            echo $exc->getTraceAsString();
        }
    }

    /**
     * @method existeEvento - Funcion para verificar la existencia de un evento
     * @param $denomimacion - Denominacion del evento a verificar
     * @param $idevento - Identificador del evento a verificar
     *
     * @return bool - Respuesta positiva o negativa de la busqueda
     * @throws Doctrine_Exception
     * @throws Exception
     * @author Orestes Rodríguez Lorenzo
     */
    public function existeEvento($denomimacion, $idevento = null)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomEventoalimentacion')->where('fdesde <= now() and (fhasta is null or fhasta > now())')
                ->andWhere("denominacion ilike '$denomimacion'");
            if (!empty($idevento)) {
                $query->andWhere("idevento <> ?", $idevento);
            }
            $result = $query->count();
            if ($result > 0) {
                return true;
            } else {
                return false;
            }
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }
}