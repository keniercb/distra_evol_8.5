<?php

/**
 *
 * @copyright  XETID
 * @package    Configuración
 * @subpackage DivisiónPolítica/Models/Domain
 * @version    1.0
 */
class NomComuna extends BaseNomComuna
{

    public function setUp()
    {
        parent::setUp();
        $this->hasMany('DatComunadpt', array('local' => 'idcomuna', 'foreign' => 'idcomuna'));
    }

    /**
     * Obtiene las comunas
     *
     * @return array
     */
    public function getComunas()
    {
        $_query = Doctrine_Query::create();
        return $_query->from('NomComuna')
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
    }

    /**
     * Inserta un NomComuna
     *
     * @param NomComuna $nomComuna
     *
     * @return code Código de respuesta
     */
    public function insertar(NomComuna $nomComuna)
    {
        $objvalidators = new NomencladoresValidator();
        if ($objvalidators->validarDenominacion('NomComuna', $nomComuna->denominacion)) {
            $nomComuna->save();
            return $nomComuna->idcomuna;
        } else {
            throw new ZendExt_Exception('NCI07');
        }
    }

    /**
     * Modifica un NomComuna
     *
     * @param NomComuna $nomComuna
     *
     * @return code Código de respuesta
     */
    public function modificar(NomComuna $nomComuna)
    {
        $nomComuna->save();
        return $nomComuna->idcomuna;
    }

    /**
     * Elimina un NomComuna
     *
     * @param NomComuna $NomComuna
     * @param mixed     $con
     *
     * @return code Código de respuesta
     * @throws Exception
     */
    public function eliminar($idcomuna, $con)
    {

        $query = new Doctrine_Query();
        try {
            $query->delete()->from('NomComuna')->where("idcomuna = '$idcomuna'")->execute();
            return true;
        } catch (Exception $e) {

            if ($e->GetCode() == 23503) {
                $con->commit();
                $queryDos = new Doctrine_Query();
                $queryDos->update('NomComuna')
                    ->set('fechafin=?', 'CURRENT_DATE')->where("idcomuna = '$idcomuna'")->execute();
                return false;
            }
        }
    }

    /**
     * Busca un NomComuna
     *
     * @param int $idcomuna Identificador de comuna
     *
     * @return object
     */
    public function Buscar($idcomuna)
    {
        return Doctrine::getTable('NomComuna')->find($idcomuna);
    }

    /**
     * Obtiene todas las comunas
     *
     * @param mixed $denom    Denominación
     * @param date  $fechaini Fecha inicio
     * @param date  $fechafin Fecha fin
     * @param mixed $ubicacion
     *
     * @return array
     */
    public function GetTodos($denom, $fechaini, $fechafin, $ubicacion)
    {
        $query = new Doctrine_Query();
        $result = $query->from('NomComuna c')
            ->innerJoin('c.DatComunadpt d')
            ->orderby('idcomuna');
        $result = self::queryGetTodos($result, $denom, $ubicacion);
        $value = self::fechaGetTodos($fechafin, $fechaini);
        /* $value == 10 es equivalente a ($fechafin == '') && ($fechaini != '') */
        $result = $value == 10 ? $result->addWhere("fechaini = ('%$fechaini%')") : $result;
        /* $value == 20 es equivalente a ($fechafin != '') && ($fechaini == '') */
        $result = $value == 20 ? $result->addWhere("fechafin <= '$fechafin' ") : $result;
        /* $value == 0 es equivalente a ($fechafin != '') && ($fechaini != '') */
        $result = $value == 0 ? $result->addWhere("fechaini >= '$fechaini' and fechafin <= '$fechafin'") : $result;
        $final = $result->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        return $final;
    }

    /**
     * Comparte las funcionalidades de GetTodos y GetPorLimite
     *
     * @param date $fechafin    Fecha fin
     * @param date $fechainicio Fecha inicio
     *
     * @return int $value Retorna '0' cuando las fechas son diferentes, '10' fechafin es vacia y fechainicio no,
     * '20' fechainicio vacia y fechafin no, y '30' ninguna es vacia.
     */
    private function fechaGetTodos($fechafin, $fechainicio)
    {
        $value = 0;
        if ($fechafin == '') {
            $value += 10;
        }
        if ($fechainicio == '') {
            $value += 20;
        }
        return $value;
    }

    /**
     * Obtiene todas las comunas por límites
     *
     * @param int   $limite   Límite superior
     * @param int   $inicio   Comienzo inferior
     * @param string $denom    Denominación
     * @param date  $fechaini Fecha inicio
     * @param date  $fechafin Fecha fin
     * @param string $ubicacion Ubicación
     *
     * @return array
     */
    public function GetPorLimite(
        $limite = false, $inicio = false, $denom = '', $fechaini = '', $fechafin = '', $ubicacion = ''
    )
    {
        $query = new Doctrine_Query();
        $result = $query->from('NomComuna c')->innerJoin('c.DatComunadpt d');
        $result = ($limite) ? $result->limit($limite) : $result;
        $result = ($inicio) ? $result->offset($inicio) : $result;
        $result = $result->orderby('idcomuna');
        $result = self::queryGetTodos($result, $denom, $ubicacion);
        $value = self::fechaGetTodos($fechafin, $fechaini);
        /* $value == 10 es equivalente a ($fechafin == '') && ($fechaini != '') */
        $result = $value == 10 ? $result->addWhere("fechaini = ('%$fechaini%')") : $result;
        /* $value == 20 es equivalente a ($fechafin != '') && ($fechaini == '') */
        $result = $value == 20 ? $result->addWhere("fechafin <= '$fechafin' ") : $result;
        /* $value == 0 es equivalente a ($fechafin != '') && ($fechaini != '') */
        $result = $value == 0 ? $result->addWhere("fechaini >= '$fechaini' and fechafin <= '$fechafin'") : $result;
        $final = $result->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        return $final;
    }

    /**
     * Comparte las funcionalidades de GetTodos y GetPorLimite
     *
     * @param query  $result    Doctrine_Query
     * @param string $denom     Denominación
     * @param string $ubicacion Ubicación
     *
     * @return query $result Doctrine_Query
     */
    private function queryGetTodos($result, $denom, $ubicacion)
    {
        $result = ($denom != '') ? $result->addWhere("lower(denominacion) LIKE lower ('%$denom%')") : $result;
        $result = ($ubicacion != '') ? $result->addWhere("d.iddpt = $ubicacion") : $result;
        return $result;
    }

    /**
     * Obtiene las comunas dado el DPT
     *
     * @param int $iddpt Identificador de División Político Administrativa
     *
     * @return array
     */
    public function getComunasDadoDpt($iddpt)
    {
        $query = new Doctrine_Query();
        $result = $query->from('NomComuna c')
            ->innerJoin('c.DatComunadpt d')
            ->where('d.iddpt = ?', $iddpt)
            ->orderby('c.denominacion')
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
            ->execute();
        return $result;
    }

    /**
     * Obtiene las comunas dado el DPT por límites
     *
     * @param int $iddpt Identificador de División Político Administrativa
     * @param int $start Comienzo inferior
     * @param int $limit Límite superior
     *
     * @return array
     */
    public function getComunasDadoDptPorLimit($iddpt, $start, $limit)
    {
        $query = new Doctrine_Query();
        $result = $query->from('NomComuna c')
            ->innerJoin('c.DatComunadpt d')
            ->where('d.iddpt = ?', $iddpt)
            ->offset($start)->limit($limit)
            ->orderby('c.denominacion')
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
            ->execute();
        return $result;
    }

    /**
     * Obtiene la cantidad de comunas dado el DPT
     *
     * @param int $iddpt Identificador de División Político Administrativa
     *
     * @return array
     */
    public function contarComunasDadoDpt($iddpt)
    {
        $query = new Doctrine_Query();
        $result = $query->select('count(c.idcomuna) as cant')
            ->from('NomComuna c')
            ->innerJoin('c.DatComunadpt d')
            ->where('d.iddpt = ?', $iddpt)
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
            ->execute();
        return $result[0]['cant'] ? $result[0]['cant'] : 0;
    }

}
