<?php

/**
 * Clase modelo para documentos primarios.
 *
 * @author     Ing. Maikel Garcia Valdes.
 * @package    Configuración
 * @subpackage Documento/Models/Bussines
 * @copyright  XETID.
 * @version    1.0-0
 */
class DocumentoModel extends ZendExt_Model
{
    /**
     * Constructor de la clase
     */
    public function __construct()
    {
        parent::ZendExt_Model();
    }

    /**
     * Adiciona un documento primario
     *
     * @param NomDocprim $objeto Objeto a adicionar
     *
     * @return int -4 si no adicionó
     * @throws ZendExt_Exception
     */
    public function insertarDocumento(NomDocprim $objeto)
    {
        try {
            $denominacion = $objeto->denominacion;
            $abreviatura = $objeto->abreviatura;
            $concepto = $objeto->concepto;
            if ($objeto->codigo) {
                $codigo = $objeto->codigo;
            }
            $objeto = NomDocprim::buscardocparam(
                array('denominacion' => $denominacion)
            );
            $objetoUno = NomDocprim::buscardocparam(
                array('abreviatura' => $abreviatura)
            );
            if ($codigo && !empty($codigo)) {
                $objetoDos = NomDocprim::buscardocparam(
                    array('codigo' => $codigo)
                );
            }
            $result = self::isValid($objeto, $objetoUno, $objetoDos);
            if ($result == '-1') {
                $objeto = new NomDocprim();
                $objeto->denominacion = $denominacion;
                $objeto->abreviatura = $abreviatura;
                $objeto->codigo = $codigo;
                $objeto->concepto = $concepto;
                $objeto->save();
                return $result;
            } else {
                return $result;
            }
        } catch (Doctrine_Exception $ee) {
            throw new ZendExt_Exception('CONF20', $ee);
        }
    }

    /**
     * Método auxiliar de "insertarDocumento"
     *
     * @param NomDocprim $objeto    Objeto
     * @param mixed      $objetoUno Objeto
     * @param mixed      $objetoDos Objeto
     *
     * @return boolean
     */
    private function isValid($objeto, $objetoUno, $objetoDos)
    {
        $result = '-1';
        if (!empty($objetoDos) && $objetoDos['cant'] >= 1) {
            $result = '-4';
        } else {
            if ($objeto['cant'] >= 1) {
                $result = '-5';
            } else {
                if ($objetoUno['cant'] >= 1) {
                    $result = '-6';
                }
            }
        }
        return $result;
    }

    /**
     * Modifica un documento primario
     *
     * @param NomDocprim $objNomDocprim Objeto a modificar
     * @param mixed      $pIdDocumento  Identificador de documento
     *
     * @return int -1 si modificó correctamente
     * @throws Doctrine_Exception
     */
    static public function modificar(NomDocprim $objNomDocprim, $pIdDocumento)
    {
        try {
            $esta = DatDocumentoprim::verificarMod(
                $objNomDocprim, $pIdDocumento
            );
            if ($esta == -1) {
                $dm = Doctrine_Manager::getInstance();
                $cc = $dm->getCurrentConnection();
                $cc->beginTransaction();
                $objNomDocprim->save();
                $cc->commit();
                return $esta;
            } else {
                return $esta;
            }
        } catch (Doctrine_Exception $dex) {
            throw $dex;
        }
    }

    /**
     * Elimina documentos primarios
     *
     * @param mixed $array            Elementos a eliminar
     * @param array $nosepudieronElim Elementos que no se pueden eliminar
     *
     * @return array Elementos que no se pueden eliminar
     * @throws Exception
     */
    static public function eliminarnDocumento(&$array, &$nosepudieronElim)
    {
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        foreach ($array as $key => $id) {
            $obj = Doctrine::getTable('NomDocprim')->find($id->iddocumentos);
            try {
                if ($obj->iddocumentos) {
                    $obj->delete();
                }
            } catch (Doctrine_Connection_Pgsql_Exception $e) {
                if ($e->getCode() == '23503') {
                    $nosepudieronElim = self::isNullDel(
                        $nosepudieronElim, $obj
                    );
                    unset($array[$key]);
                    array_values($array);
                    if ($conn->getTransactionLevel() != 0) {
                        $conn->rollBack();
                    }
                    self::eliminarnDocumento($array, $nosepudieronElim);
                } else {
                    echo $e->getMessage();
                }
            } catch (Exception $ex) {
                echo $ex->getMessage();
            }
        }
        return $nosepudieronElim;
    }

    /**
     * Método auxiliar de verificación sobre elementos que no pueden ser eliminados
     *
     * @param mixed $nosepudieronElim Elementos que no se pueden eliminar
     * @param mixed $obj              Objeto
     *
     * @return array Elementos que no se pueden eliminar
     */
    private static function isNullDel(&$nosepudieronElim, $obj)
    {
        $nosepudieronElim .= (!$nosepudieronElim)
            ? "$obj->codigo $obj->denominacion"
            : ',' . "$obj->codigo $obj->denominacion";
        return $nosepudieronElim;
    }

    /**
     * Modifica un documento primario
     *
     * @param mixed $objeto Objeto a modificar
     *
     * @return boolean
     * @throws ZendExt_Exception
     */
    public function modificarDoc($objeto)
    {
        try {
            $sigla = $objeto->sigla;
            $idestructurasubsist = $objeto->idestructurasubsist;

            $objDocPrim = $objeto->BuscarDocumentoParam(
                array('sigla'               => $sigla,
                      'idestructurasubsist' => $idestructurasubsist)
            );
            if (count($objDocPrim) == 0) {
                $objeto->sigla = $sigla;
                $objeto->save();
                return true;
            } else {
                return false;
            }
        } catch (Doctrine_Exception $ee) {
            throw new ZendExt_Exception('CONF145', $ee);
        }
    }

}
