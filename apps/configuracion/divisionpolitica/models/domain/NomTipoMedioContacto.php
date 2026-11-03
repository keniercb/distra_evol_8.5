<?php

/**
 *
 * @copyright  XETID
 * @package    Configuración
 * @subpackage DivisiónPolítica/Models/Domain
 * @version    1.0
 */
class NomTipoMedioContacto extends BaseNomTipoMedioContacto
{
    public function setUp()
    {
        parent::setUp();
        $this->hasMany(
            "NomFormatoTipoMedioContacto",
            array('local' => 'idformatotipomediocontacto', 'foreign' => 'idformatotipomediocontacto')
        );
    }

    /**
     * Inserta un NomTipoMedioContacto
     *
     * @param NomTipoMedioContacto $nomTipoMedioContacto
     *
     * @return code Código de respuesta
     */
    public function insertar(NomTipoMedioContacto $nomTipoMedioContacto)
    {
        $objvalidators = new NomencladoresValidator();
        if ($objvalidators->validarDenominacionMedioContacto('NomTipoMedioContacto', $nomTipoMedioContacto->denom)) {
            $nomTipoMedioContacto->save();
            return $nomTipoMedioContacto->idtipomediocontacto;
        } else {
            throw new ZendExt_Exception('NCI15');
        }
    }

    /**
     * Obtiene la cantidad de DatContacto
     *
     * @param int $idnomenclador Identificador de nomenclador
     *
     * @return code Código de respuesta
     * @throws Doctrine_Exception
     */
    public function cant($idnomenclador)
    {
        try {
            $contador = 0;
            $sql = new Doctrine_Query();
            $contador = $sql->select('a.idpersona')
                ->from('DatContacto a')
                ->innerJoin('a.NomTipoMedioContacto b')
                ->where("b.idtipomediocontacto ='$idnomenclador'")
                ->count();
            return $contador;
        } catch (Doctrine_Exception $e) {
            return $e;
        }

    }

    /**
     * Modifica un NomTipoMedioContacto
     *
     * @param NomTipoMedioContacto $nomTipoMedioContacto
     *
     * @return code Código de respuesta
     */
    public function modificar(NomTipoMedioContacto $nomTipoMedioContacto)
    {
        $nomTipoMedioContacto->save();
        return $nomTipoMedioContacto->idtipomediocontacto;
    }

    /**
     * Elimina un NomTipoMedioContacto
     *
     * @param int   $idtipomediocontacto Identificador de medio contacto
     * @param mixed $con
     *
     * @return code Código de respuesta
     * @throws Doctrine_Exception
     */
    public function eliminar($idtipomediocontacto, $con)
    {
        $query = new Doctrine_Query();
        try {
            $query->delete()->from('NomTipoMedioContacto')->where(
                "idtipomediocontacto = '$idtipomediocontacto'"
            )->execute();
            return true;
        } catch (Exception $e) {
            $con->commit();
            $queryDos = new Doctrine_Query();
            $queryDos->update('NomTipoMedioContacto')->set('hasta=?', 'CURRENT_DATE')
                ->where("idtipomediocontacto = '$idtipomediocontacto'")->execute();
            return false;
        }
    }

    /**
     * Obtiene todos los NomTipoMedioContacto
     *
     * @param mixed $denom    Denominación
     * @param date  $fechaini Fecha inicio
     * @param date  $fechafin Fecha fin
     *
     * @return array
     */
    public function GetTodosMedios($denom, $fechaini, $fechafin)
    {
        $query = new Doctrine_Query();
        $result = $query->from('NomTipoMedioContacto')->orderby('idtipomediocontacto');
        $result = ($denom != '') ? $result->addWhere("lower(denom) LIKE lower ('%$denom%')") : $result;
        $value = self::fechaGetTodos($fechafin, $fechaini);
        /* $value == 10 es equivalente a ($fechafin == '') && ($fechaini != '') */
        $result = $value == 10  ? $result->addWhere("hasta = ('%$fechaini%')") : $result;
        /* $value == 20 es equivalente a ($fechafin != '') && ($fechaini == '') */
        $result = $value == 20 ? $result->addWhere("desde <= '$fechafin' ") : $result;
        /* $value == 0 es equivalente a ($fechafin != '') && ($fechaini != '') */
        $result = $value == 0 ? $result->addWhere("hasta >= '$fechaini' and desde <= '$fechafin' ") : $result;
        $final = $result->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        return $final;
    }

    /**
     * Comparte las funcionalidades de GetTodosMedios y GetPorLimiteMedios
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
     * Obtiene todos los NomTipoMedioContacto por límites
     *
     * @param int   $limite   Límite superior
     * @param int   $inicio   Comienzo inferior
     * @param mixed $denom    Denominación
     * @param date  $fechaini Fecha inicio
     * @param date  $fechafin Fecha fin
     *
     * @return array
     */
    public function GetPorLimiteMedios($limite = 20, $inicio = 0, $denom = null, $fechaini = null , $fechafin = null)
    {
        $query = new Doctrine_Query();
        $result = $query->from('NomTipoMedioContacto a')
            ->innerJoin('a.NomFormatoTipoMedioContacto')
            ->limit($limite)
            ->offset($inicio)
            ->orderby('idtipomediocontacto');
        $result = ($denom != '') ? $result->addWhere("lower(denom) LIKE lower ('%$denom%')") : $result;
        $value = self::fechaGetTodos($fechafin, $fechaini);
        /* $value == 10 es equivalente a ($fechafin == '') && ($fechaini != '') */
        $result = $value == 10  ? $result->addWhere("hasta = ('%$fechaini%')") : $result;
        /* $value == 20 es equivalente a ($fechafin != '') && ($fechaini == '') */
        $result = $value == 20 ? $result->addWhere("desde <= '$fechafin' ") : $result;
        /* $value == 0 es equivalente a ($fechafin != '') && ($fechaini != '') */
        $result = $value == 0 ? $result->addWhere("hasta >= '$fechaini' and desde <= '$fechafin' ") : $result;
        $final = $result->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        return $final;
    }

    /**
     * Obtiene todos los activos
     *
     * @return array
     * @throws Doctrine_Exception
     */
    public function GetTodosActivos()
    {
        try {

            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $sql
                = "select tmc.idtipomediocontacto, tmc.denom as tipomediocontacto,
                 tmc.descripcion, tfmc.expresionregular
                 from mod_configsecodena.nom_tipomediocontacto tmc
                 inner join mod_configsecodena.nom_formatotipomediocontacto tfmc on
                 (tfmc.idformatotipomediocontacto = tmc.idformatotipomediocontacto)
                  where tmc.hasta <= 'now()' or tmc.hasta IS NULL";
            $resultado = $conn->fetchAll($sql);
            return $resultado;
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    /**
     * Obtiene todos los NomTipoMedioContacto
     *
     * @param array $arr
     *
     * @return array
     * @throws Doctrine_Exception
     */
    public function GetTodosporArrIds($arr)
    {
        try {

            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $sql
                = "select tmc.idtipomediocontacto, tmc.denom as tipomediocontacto, tmc.descripcion,
                tfmc.expresionregular  from mod_configsecodena.nom_tipomediocontacto tmc
                  inner join mod_configsecodena.nom_formatotipomediocontacto tfmc on
                  (tfmc.idformatotipomediocontacto = tmc.idformatotipomediocontacto)
                  where tmc.idtipomediocontacto in (" . implode(',', $arr) . ")  order by tmc.idtipomediocontacto;";
            $resultado = $conn->fetchAll($sql);
            return $resultado;
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    /**
     * Obtiene la llave
     *
     * @return int
     */
    public function GetLLave()
    {
        try {
            $query = new Doctrine_Query();
            $result = $query->select('MAX(idtipomediocontacto)')->from('NomTipoMedioContacto')->execute();
            $arr = $result->toArray();
            return (is_array($arr) ? $arr[0]['MAX'] + 1 : 1);
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    /**
     * Busca un NomTipoMedioContacto
     *
     * @param int $idtipomediocontacto Identificador de tipo medio contacto
     *
     * @return object
     */
    public function BuscarMedio($idtipomediocontacto)
    {
        return Doctrine::getTable('NomTipoMedioContacto')->find($idtipomediocontacto);
    }


    /**
     * Busca un NomTipoMedioContacto
     *
     * @param int $idtipomediocontacto Identificador de tipo medio contacto
     *
     * @return array
     * @throws Doctrine_Exception
     */
    public function Buscar($idtipomediocontacto)
    {
        try {
            $temp = $this->getTable('NomTipoMedioContacto')->find($idtipomediocontacto);
            return $temp->toArray();
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    /**
     * Obtiene todos los datos de NomTipoMedioContacto
     *
     * @return array
     * @throws Doctrine_Exception
     */
    public function GetTodos()
    {
        try {
            $query = new Doctrine_Query();
            $result = $query->select('*')->from('NomTipoMedioContacto')->where(
                "hasta < 'CURRENT_DATE' or hasta IS NULL"
            )->execute();
            return $result->toArray();
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    /**
     * Obtiene todos de NomTipoMedioContacto por límites
     *
     * @param int $limite Límite superior
     * @param int $inicio Comienzo inferior
     *
     * @return array
     * @throws Doctrine_Exception
     */
    public function GetPorLimite($limite = 10, $inicio = 0)
    {
        try {
            $query = new Doctrine_Query();
            $result = $query->from('NomTipoMedioContacto')->limit($limite)->offset($inicio)->execute();
            return $result->toArray();
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    /**
     * Obtiene la cantidad por tipo
     *
     * @param int $idnomenclador Identificador de nomenclador
     *
     * @return array
     * @throws Doctrine_Exception
     */
    public function canttipo($idnomenclador)
    {
        try {
            $contador = 0;
            $sql = new Doctrine_Query();
            $contador = $sql->select('a.contacto')
                ->from('DatContacto a')
                ->innerJoin('a.NomTipoMedioContacto b')
                ->where("b.idtipomediocontacto ='$idnomenclador'")
                ->count();
            return $contador;
        } catch (Doctrine_Exception $e) {
            return $e;
        }

    }
}//fin clase


