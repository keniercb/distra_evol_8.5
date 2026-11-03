<?php

/**
 * Clase modelo del nomenclador de <b>Pais</b>.
 *
 * @author     Ing. Miguel Diaz Riveaux.
 * @package    Configuración
 * @subpackage DivisiónPolítica/Models/Bussines
 * @copyright  XETID.
 * @version    1.0
 */
class NomPaisModel extends ZendExt_Model
{

    /**
     * Constructor de la clase
     */
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    /**
     * Adicionar un objeto Pa&iacute;s.
     *
     * @param NomPais $objNomPais Objeto de un Pa&iacute;s.
     *
     * @throws Doctrine_Exception $exception Excepci&oacute;n de doctrine ocurrida durante la transacci&oacute;n.
     * @return Boolean Devuelve verdadero si fue realizada la operaci&oacute;n, falso de lo contrario.
     */
    public function Adicionar(NomPais $objNomPais)
    {
        try {
            $dm = Doctrine_Manager::getInstance();
            $cc = $dm->getCurrentConnection();
            $cc->beginTransaction();
            $objNomPais->save();
            $cc->commit();
            return true;
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * Modificar un objeto Pa&iacute;s.
     *
     * @param NomPais $objNomPais Objeto de un Pa&iacute;s.
     *
     * @throws Doctrine_Exception $exception Excepci&oacute;n de doctrine ocurrida durante la transacci&oacute;n.
     * @return Boolean Devuelve verdadero si fue realizada la operaci&oacute;n, falso de lo contrario.
     */
    public function Modificar(NomPais $objNomPais)
    {
        try {
            $dm = Doctrine_Manager::getInstance();
            $cc = $dm->getCurrentConnection();
            $cc->beginTransaction();
            $objNomPais->save();
            $cc->commit();
            return true;
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * Eliminar un objeto Pa&iacute;s.
     *
     * @param NomPais $objNomPais Objeto de un Pa&iacute;s.
     *
     * @throws Doctrine_Exception $exception Excepci&oacute;n de doctrine ocurrida durante la transacci&oacute;n.
     * @return Boolean Devuelve verdadero si fue realizada la operaci&oacute;n, falso de lo contrario.
     */
    public function Eliminar(NomPais $objNomPais)
    {
        try {
            $dm = Doctrine_Manager::getInstance();
            $cc = $dm->getCurrentConnection();
            $cc->beginTransaction();
            $objNomPais->delete();
            $cc->commit();
            return true;
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * Valida el modificar
     *
     * @param object $obj
     *
     * @return bool
     */
    public function ValidarMod($obj)
    {
        $codigopais = $obj->codigopais;
        $nombrepais = $obj->nombrepais;
        $idpais = $obj->idpais;
        $formagen = $obj->buscar(array('idpais' => $idpais));
        $valid = false;
        if ($formagen['cant']) {
            if ($formagen['datos'][0]['codigopais'] != $codigopais
                && ($formagen['datos'][0]['nombrepais'] == $nombrepais)
            ) {
                $valid = self::validarModBuscar($obj, array('codigopais' => $codigopais), $idpais);
            } elseif ($formagen['datos'][0]['nombrepais'] != $nombrepais) {
                $valid = self::validarModBuscar($obj, array('nombrepais' => $nombrepais), $idpais);
            } else {
                $paisg = $obj->buscar(array('codigopais' => $codigopais, 'nombrepais' => $nombrepais));
                if ($paisg['cant']) {
                    $valid = true;
                } else {
                    $valid = false;
                }
            }
        }
        return $valid;
    }

    /**
     * Comparte la funcionalidad de ValidarMod
     *
     * @param object $cant
     * @param mixed  $filtro   Filtro de búsqueda
     * @param int    $idpais   Identificador de país
     *
     * @return bool $valid
     */
    private function validarModBuscar($obj, $filtro, $idpais)
    {
        $paiscod = $obj->buscar($filtro);
        if (($paiscod['cant'] == 1 && $idpais == $paiscod['datos'][0]['idpais']) || $paiscod['cant'] == 0) {
            $valid = true;
        } else {
            $valid = false;
        }
        return $valid;
    }

    /**
     * Valida el insertar
     *
     * @param object $obj
     *
     * @return bool
     */
    public function ValidarIns($obj)
    {
        $nombrepaisb = $obj->buscar(array('nombrepais' => $obj->nombrepais));
        $codigopaisb = $obj->buscar(array('codigopais' => $obj->codigopais));
        if (!$nombrepaisb['cant'] && !$codigopaisb['cant']) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Obtener el nomenclador de Pa&iacute;ses.
     *
     * @param Array $argFilterSql Condiciones para filtrar los pa&iacute;ses.
     *
     * @return Array Nomenclador de pa&iacute;ses.
     */
    public function obtenerNomencladorPaises($argFilterSql)
    {
        $paises = NomPais::obtenerNomPaises($argFilterSql);
        return $paises;
    }

    /**
     * Obtiene los datos para imprimir reporte
     *
     * @return array
     */
    public function obtenerDatosImprimirReporte()
    {
        list($dia, $mes, $year) = explode("/", date("d/m/Y"));
        $entidad = $this->global->Estructura;
        return array('datoGeneral' => array('reporte' => '20003', 'titulo' => 'nompais',
                                            'Entidad' => $entidad->denominacion, 'dia' => $dia, 'mes' => $mes,
                                            'year'    => $year, 'fechaactual' => date('d/m/Y')),
                     'datoCuerpo' => NomPais::obtenerArrayNomPaises());
    }

}