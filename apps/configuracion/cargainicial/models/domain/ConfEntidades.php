<?php

/**
 *
 * @copyright  XETID
 * @package    Configuración
 * @subpackage CargaInicial/Models/Domain
 * @version    1.0
 */
class ConfEntidades extends BaseConfEntidades
{
    public function setUp()
    {
        parent::setUp();
    }

    /**
     * Inserta un ConfEntidades
     *
     * @param int $idestructura Identificador de estructura
     *
     * @return code Código de respuesta
     */
    public function Insertar($idestructura)
    {
        try {
            $query = Doctrine_Query::create();
            $ver = $query->from('ConfEntidades d')->where('d.idestructuracomun=?', $idestructura)->execute()->toArray();
            $x = $ver[0]['idconfiguracion'];

            $carga = Doctrine::getTable('ConfEntidades')->find($x);
            $carga->configurado = 1;
            $carga->save();
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * Verifica la entidad configurada
     *
     * @param int $idestructura Identificador de estructura
     *
     * @return mixed ConfEntidad
     */
    public function entidadConfigurada($idestructura)
    {
        $query = Doctrine_Query::create();
        $res = $query->from("ConfEntidades e")
            ->where('e.idestructuracomun=?', $idestructura)
            ->execute();
        return $res[0]['configurado'];
    }

    /**
     * Limpia la entidad configurada
     * @return bool
     */
    public function limpiarEntidadConfigurada()
    {
        $query = Doctrine_Query::create();
        $datos = $query->from('ConfEntidades d')->where('d.configurado = 1')->execute()->toArray();

        if (!$datos) {
            return true;
        } else {
            if (!$datos[1]) {
                $idconfiguracion = $datos[0]['idconfiguracion'];
                $entidad = Doctrine::getTable('ConfEntidades')->find($idconfiguracion);
                $entidad->configurado = 0;
                $entidad->save();
                return true;
            }
        }

        return false;
    }

    /**
     * Actualiza la entidad importación
     *
     * @param int $idestructura Identificador de estructura
     * @param int $valor Valor
     */
    public function actualizarEntidadImportacion($idestructura, $valor)
    {
        $query = Doctrine_Query::create();
        $datos = $query->from('ConfEntidades d')->where('d.idestructuracomun=?', $idestructura)->execute()->toArray();
        $idconfiguracion = $datos[0]['idconfiguracion'];

        $entidad = Doctrine::getTable('ConfEntidades')->find($idconfiguracion);

        if ($valor == 3) {
            $entidad->configurado = -1;
        } else {
            $entidad->configurado = $valor;
        }
        $entidad->save();

        $dm = Doctrine_Manager::getInstance();
        $cc = $dm->getCurrentConnection();
        $cc->commit();
        $cc->beginTransaction();
    }

    /**
     * Obtiene la entidad configurada
     *
     * @param int $idestructura Identificador de estructura
     *
     * @return mixed ConfEntidad
     */
    public function BuscarEntConf($idestructura)
    {
        $query = Doctrine_Query::create();
        $ver = $query->from('ConfEntidades d')->where('d.idestructuracomun=?', $idestructura)->execute()->toArray();
        return $ver[0]['idconfiguracion'];
    }

    /**
     * Verifica la existencia de entidades configuradas
     *
     * @param int $param
     *
     * @return bool ConfEntidad
     */
    public function existenEntidadesConfiguradas($param)
    {
        $query = Doctrine_Query::create();
        if ($param == 1) {
            $datos = $query->from('ConfEntidades d')->where('d.configurado = 1')->execute()->toArray();
        } elseif ($param == 2) {
            $datos = $query->from('ConfEntidades d')->execute()->toArray();
        }

        if ($datos) {
            return true;
        }
        return false;
    }


}//fin clase
