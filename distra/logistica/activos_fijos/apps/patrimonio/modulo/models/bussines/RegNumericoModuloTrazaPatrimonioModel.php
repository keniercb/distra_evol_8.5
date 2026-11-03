<?php

/**
 * Clase que implementa todos los métodos relacionados a las trazas de las operaciones de un registro numérico
 * como un módulo
 *
 * @autor Jorge Luis Cuellar Mondeja
 */
class RegNumericoModuloTrazaPatrimonioModel extends BaseModel
{

    public function __construct()
    {
        parent::__construct();
    }

    /**
     *  Guardar traza cuando se adiciona un elemento a un módulo
     */
    private function saveTrazasHijas(&$objModuloTrazaHijos, $medios, $idModuloTraza, $pKey = false)
    {
        $sRegNumerico = new RegNumericoService();

        $pos = ($pKey) ? $pKey : 0;
        foreach ($medios as $key => $value) {
            $objModuloTrazaHijos[($pKey) ? $pos : $key]->idregnumerico = $value->idregnumerico;
            $objModuloTrazaHijos[($pKey) ? $pos : $key]->idmodulotraza = $idModuloTraza;
            $movRegNumerico = $sRegNumerico->getUltimoIdMovRegNumerico($value->idregnumerico);
            $objModuloTrazaHijos[($pKey) ? $pos : $key]->idmovregnumerico = $movRegNumerico;

            if ($pKey) {
                $pos++;
            }
        }
        $objModuloTrazaHijos->save();
    }

    /**
     * Guardar la traza cuando se elimina un módulo
     */
    private function eliminarTrazasModuloTraza($parametros, $fecha)
    {
        $query = Doctrine_Query::create();

        $query->from('DatModulotraza mt');
        $query->addSelect('mt.idmodulotraza');
        $query->addWhere('mt.idregistronumerico = ?', array($parametros[0]->idregnumerico));
        $query->addWhere('mt.fecha = ?', array($fecha));

        Doctrine_Query::create()->delete()
            ->from('DatModulotrazaHijos mth')
            ->where('mth.idmodulotraza = ?', $query->fetchOne()->idmodulotraza)
            ->execute();
    }

    /**
     *  Guardar la traza cuando se elimina un elemento de un módulo
     */
    private function eliminarTrazaHijoModulo($idRegNumerico, $fecha)
    {
        $objModuloTraza = new DatModulotraza();
        $objModuloTrazaHijos = new Doctrine_Collection('DatModulotrazaHijos');

        $datRegNumericoActivo = Doctrine::getTable('DatRegnumericoActivo')->find($idRegNumerico);
        $idPadre = $datRegNumericoActivo->idpadre;

        $query = Doctrine_Query::create();
        $queryHijo = Doctrine_Query::create();

        $query->from('DatModulotraza mt');
        $query->addSelect('mt.idmodulotraza');
        $query->addWhere('mt.idregistronumerico = ?', array($idPadre));
        $query->addWhere('mt.fecha = ?', array($fecha));

        $idModuloTraza = $query->fetchOne()->idmodulotraza;

        if ($idModuloTraza) {
            $queryHijo->delete()
                ->from('DatModulotrazaHijos mth')
                ->where('mth.idmodulotraza = ?', $idModuloTraza)
                ->where('mth.idregnumerico = ?', $idRegNumerico)
                ->execute();
        } else {
            $query = Doctrine_Query::create();

            $query->from('DatModulotraza mt');
            $query->addSelect('mt.idmodulotraza');
            $query->addWhere('mt.idregistronumerico = ?', array($idPadre));
            $query->addWhere('mt.fecha < ?', array($fecha));
            $query->orderBy('mt.fecha DESC');
            $idModuloTraza = $query->fetchOne()->idmodulotraza;

            $queryHijo->from('DatModulotrazaHijos mth');
            $queryHijo->innerJoin('mth.DatModulotraza traza');
            $queryHijo->addSelect('traza.idregistronumerico, traza.idmovregnumerico, traza.idusuario');
            $queryHijo->addWhere("mth.idmodulotraza = ?", array($idModuloTraza));
            $queryHijo->addWhere('mth.idregnumerico = ?', array($idRegNumerico));
            $padre = $query->fetchOne();

            $objModuloTraza->idregistronumerico = $padre->idregistronumerico;
            $objModuloTraza->idmovregnumerico = $padre->idmovregnumerico;
            $objModuloTraza->idusuario = $padre->idusuario;
            $objModuloTraza->fecha = $fecha;
            $objModuloTraza->save();

            $queryPadre = Doctrine_Query::create();
            $queryPadre->from('DatModulotraza mt');
            $queryPadre->select('mt.idregistronumerico');
            $queryPadre->addWhere('mt.fecha < ?', "'{$fecha}'");
            $queryPadre->orderBy('mt.fecha DESC');
            $idPadre = $queryPadre->fetchOne()->idregistronumerico;

            if ($idPadre) {

                $queryHijos = Doctrine_Query::create();
                $queryHijos->from('DatModulotrazaHijos mth');
                $queryHijos->innerJoin('mth.DatModulotraza traza');
                $queryHijos->addWhere(' mth.idmodulotraza = ?', array($idPadre));
                $queryHijos->addWhere(' mth.idregnumerico <> ?', array($idRegNumerico));
                $hijos = $queryHijos->fetchArray();

                foreach ($hijos as $key => $value) {
                    $value['idmodulotraza'] = $objModuloTraza->idmodulotraza;
                    $objModuloTrazaHijos[$key]->synchronizeWithArray($value);
                }
                $objModuloTrazaHijos->save();
            }
        }
    }

    /**
     *  Guardar la traza cuando se eliminan varios módulo
     */
    private function guardarTrazaEliminarVarios($parametros)
    {
        $fecha = date("d/m/Y");
        $idRegNumerico = $parametros[0]->idregnumerico;

        // Si se eliminan varios medios
        foreach ($parametros as $value) {
            if ($value->esmodulo == 2) {

                $parametros[0]->idregnumerico = $value->idregnumerico;
                $this->eliminarTrazasModuloTraza($parametros, $fecha);
            } else {
                $this->eliminarTrazaHijoModulo($idRegNumerico, $fecha);
            }
        }
    }

    /**
     * Guardar la traza cuando se adiciona un módulo
     */
    public function guardarTrazaAdicionar($parametros)
    {
        $sRegNumerico = new RegNumericoService();
        $global = ZendExt_GlobalConcept::getInstance();
        $perfil = 'Perfil';

        $idRegNumerico = $parametros->idmodulo;
        $idMovRegNumerico = $sRegNumerico->getUltimoIdMovRegNumerico($idRegNumerico);

        $idusuario = $global->$perfil->idusuario;
        $fecha = date("d/m/Y");

        // Busco la Traza
        $query = new Doctrine_Query();
        $query->from('DatModulotraza traza')
            ->where(
                "traza.idregistronumerico = ? and traza.fecha = ? and traza.idusuario = ?",
                array($parametros->idmodulo, $fecha, $idusuario)
            );
        $modulo = $query->fetchArray();

        $objModuloTraza = new DatModulotraza();
        $objModuloTrazaHijos = new Doctrine_Collection('DatModulotrazaHijos');

        // Si la Traza no está, la adiciono
        if (count($modulo) == 0) {
            $objModuloTraza->idregistronumerico = $idRegNumerico;
            $objModuloTraza->idmovregnumerico = $idMovRegNumerico;
            $objModuloTraza->idusuario = $idusuario;
            $objModuloTraza->fecha = $fecha;
            $objModuloTraza->save();

            $queryTrazas = new Doctrine_Query();
            $queryTrazas->from('DatModulotraza mth');
            $queryTrazas->addSelect('mth.idmodulotraza');
            $queryTrazas->addWhere('mth.fecha < ?', "{$fecha}");
            $queryTrazas->orderBy('mth.fecha desc');

            $query = new Doctrine_Query();
            $query->from('DatModulotrazaHijos mth');
            $query->addSelect(
                'mth.idmodulotrazahijo,
                 mth.idmodulotraza,
                 mth.idmovregnumerico,
                 mth.idregnumerico'
            );
            $query->innerJoin('mth.DatModulotraza mt');
            $query->addWhere('mth.idmodulotraza = ?', array($queryTrazas->fetchOne()->idmodulotraza));
            $hijos = $query->fetchArray();

            if (count($hijos) > 0) {
                foreach ($hijos as $key => $value) {
                    $value['idmodulotraza'] = $objModuloTraza->idmodulotraza;
                    $objModuloTrazaHijos[$key]->synchronizeWithArray($value);
                }

                $pos = count($hijos);
                $this->saveTrazasHijas($objModuloTrazaHijos, $parametros->medios, $objModuloTraza->idmodulotraza, $pos);
            } else {

                $this->saveTrazasHijas($objModuloTrazaHijos, $parametros->medios, $objModuloTraza->idmodulotraza);
            }
        } else { // Si la Traza está, le adiciono los hijos
            $this->saveTrazasHijas($objModuloTrazaHijos, $parametros->medios, $modulo[0]['idmodulotraza']);
        }
    }

    /**
     * Guardar la traza cuando se elimina un módulo
     */
    public function guardarTrazaEliminar($parametros)
    {
        $fecha = date("d/m/Y");
        $idRegNumerico = $parametros[0]->idregnumerico;

        // Si se elimina un solo medio
        if (count($parametros) == 1) {

            // Verifica si es un módulo, para eliminarle todos sus hijos
            if ($parametros[0]->esmodulo == 2) {
                $this->eliminarTrazasModuloTraza($parametros, $fecha);
            } else {
                // Si no es un módulo, se elimina en la lista de hijos de su padre
                $this->eliminarTrazaHijoModulo($idRegNumerico, $fecha);
            }
        } else {
            // Si se eliminan varios medios
            $this->guardarTrazaEliminarVarios($parametros);
        }
    }

}
