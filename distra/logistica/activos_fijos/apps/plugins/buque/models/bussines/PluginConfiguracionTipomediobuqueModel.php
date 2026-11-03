<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of PluginActivotransporteModel
 *
 * @author Gerardo
 */
class PluginConfiguracionTipomediobuqueModel extends BaseModel implements ICompositeModel
{

    public function addJoinModel(Doctrine_Query $query, $aliasExterno, $aliasLocal, $includeSelect = true,
        $parametros = array())
    {
        $query->leftJoin("$aliasExterno.CfgTipoMedioBuque $aliasLocal");

        if ($includeSelect) {
            $query->addSelect($this->getQuerySelectFields($aliasLocal));
        }
    }

    public function addQueryFilters(Doctrine_Query $query, $aliasTabla, $parametros = array())
    {
        return $query;
    }

    public function beforeDelete($identifier)
    {
        return;
    }

    public function beforeSave(Doctrine_Record $model, $parametros = array())
    {
        $model->CfgTipoMedioBuque->synchronizeWithArray($parametros);
    }

    public function getQuerySelectFields($alias)
    {
        $arrayQueryStrings = array(
            'codigo' => '_p.codigo',
            'nombre' => '_p.nombre',
            'bandera' => '_p.bandera',
            'nrooficial' => '_p.nrooficial',
            'nroimo' => '_p.nroimo',
            'casaclasific' => '_p.casaclasific',
            'velocidad' => '_p.velocidad',
            'telex' => '_p.telex',
            'fax' => '_p.fax',
            'correo' => '_p.correo',
            'calado' => '_p.calado',
            'eslora' => '_p.eslora',
            'manga' => '_p.manga',
            'muerto' => '_p.muerto',
            'neto' => '_p.neto',
            'bruto' => '_p.bruto',
            'letrallamada' => '_p.letrallamada'
        );
        return $this->doctrineHelper->getStrSelectString($arrayQueryStrings, $alias, '_p');
    }

    public function initBaseRelation(Doctrine_Record $ConfTipoMedio)
    {
        $array[] = array('cardinalidad' => 'one',
            'relation' => 'CfgTipoMedioBuque',
            'properties' => array('local' => 'idtipomedio', 'foreign' => 'idtipomediobuque'));

        LogisticaDoctrineHelper::__init()->tryInyectRelactions($ConfTipoMedio, $array);
    }

    public function getArrayColumnasVacias($parametros)
    {
        $newArray = array(
            'nombre' => 0,
            'codigo' => 0,
            'bandera' => 0,
            'nrooficial' => 0,
            'casaclasific' => 0,
            'nroimo' => 0,
            'velocidad' => 0,
            'letrallamada' => 0,
            'telex' => 0,
            'fax' => 0,
            'correo' => 0,
            'calado' => 0,
            'eslora' => 0,
            'manga' => 0,
            'muerto' => 0,
            'neto' => 0,
            'bruto' => 0
        );
        return array_merge($parametros, $newArray);
    }

    public function getLabelNameObjectsFromData($data, &$result)
    {
        foreach ($data as $artib => $valor) {
            if ($valor[$artib] == 1) {
                if ($artib == 'nombre') {
                    $obj = new stdClass();
                    $obj->label = 'Nombre';
                    $obj->name = 'nombre';
                    $obj->descripcion = 'Nombre';
                    $obj->ownerPlugins = true;
                    $obj->namePlugin = "Datos del buque";
                    $obj->idPlugin = "buque";
                    $obj->allowBlank = true;
                    $obj->tipo = 'textfield';
                    array_push($result, $obj);
                }
                if ($artib == 'codigo') {
                    $obj = new stdClass();
                    $obj->label = 'C&oacute;digo';
                    $obj->name = 'codigo';
                    $obj->descripcion = 'C&oacute;digo';
                    $obj->ownerPlugins = true;
                    $obj->namePlugin = "Datos del buque";
                    $obj->idPlugin = "buque";
                    $obj->allowBlank = true;
                    $obj->tipo = 'textfield';
                    array_push($result, $obj);
                }
                if ($artib == 'bandera') {
                    $obj = new stdClass();
                    $obj->label = 'Bandera';
                    $obj->name = 'idbandera';
                    $obj->descripcion = 'Bandera';
                    $obj->ownerPlugins = true;
                    $obj->namePlugin = "Datos del buque";
                    $obj->idPlugin = "buque";
                    $obj->allowBlank = true;
                    $obj->tipo = 'combo';
                    array_push($result, $obj);
                }
                if ($artib == 'nrooficial') {
                    $obj = new stdClass();
                    $obj->label = 'N&uacute;mero oficial';
                    $obj->name = 'nrooficial';
                    $obj->descripcion = 'N&uacute;mero oficial';
                    $obj->ownerPlugins = true;
                    $obj->namePlugin = "Datos del buque";
                    $obj->idPlugin = "buque";
                    $obj->allowBlank = true;
                    $obj->tipo = 'numberfield';
                    array_push($result, $obj);
                }
                if ($artib == 'nroimo') {
                    $obj = new stdClass();
                    $obj->label = 'N&uacute;mero IMO';
                    $obj->descripcion = 'N&uacute;mero IMO';
                    $obj->name = 'nroimo';
                    $obj->ownerPlugins = true;
                    $obj->namePlugin = "Datos del buque";
                    $obj->idPlugin = "buque";
                    $obj->allowBlank = true;
                    $obj->tipo = 'numberfield';
                    array_push($result, $obj);
                }
                if ($artib == 'casaclasific') {
                    $obj = new stdClass();
                    $obj->label = 'Casa clasificadora';
                    $obj->name = 'idcasaclasifc';
                    $obj->descripcion = 'Casa clasificadora';
                    $obj->ownerPlugins = true;
                    $obj->namePlugin = "Datos del buque";
                    $obj->idPlugin = "buque";
                    $obj->allowBlank = true;
                    $obj->tipo = 'combo';
                    array_push($result, $obj);
                }
                if ($artib == 'velocidad') {
                    $obj = new stdClass();
                    $obj->label = 'Velocidad(nudo)';
                    $obj->descripcion = 'Velocidad(nudo)';
                    $obj->name = 'velocidad';
                    $obj->ownerPlugins = true;
                    $obj->namePlugin = "Datos del buque";
                    $obj->idPlugin = "buque";
                    $obj->allowBlank = true;
                    $obj->tipo = 'numberfield';
                    array_push($result, $obj);
                }
                if ($artib == 'letrallamada') {
                    $obj = new stdClass();
                    $obj->label = 'Letra de llamada';
                    $obj->descripcion = 'Letra de llamada';
                    $obj->name = 'letrallamada';
                    $obj->ownerPlugins = true;
                    $obj->namePlugin = "Datos del buque";
                    $obj->idPlugin = "buque";
                    $obj->allowBlank = true;
                    $obj->tipo = 'textfield';
                    array_push($result, $obj);
                }              
                if ($artib == 'telex') {
                    $obj = new stdClass();
                    $obj->label = 'Telex';
                    $obj->descripcion = 'Telex';
                    $obj->name = 'telex';
                    $obj->ownerPlugins = true;
                    $obj->namePlugin = "Datos del buque";
                    $obj->idPlugin = "buque";
                    $obj->allowBlank = true;
                    $obj->tipo = 'textfield';
                    array_push($result, $obj);
                }
                if ($artib == 'ficav') {
                    $obj = new stdClass();
                    $obj->label = 'Fax';
                    $obj->descripcion = 'Fax';
                    $obj->name = 'ficav';
                    $obj->ownerPlugins = true;
                    $obj->namePlugin = "Datos del buque";
                    $obj->idPlugin = "buque";
                    $obj->allowBlank = true;
                    $obj->tipo = 'numberfield';
                    array_push($result, $obj);
                }
                if ($artib == 'correo') {
                    $obj = new stdClass();
                    $obj->label = 'E-Mail';
                    $obj->descripcion = 'E-Mail';
                    $obj->name = 'correo';
                    $obj->ownerPlugins = true;
                    $obj->namePlugin = "Datos del buque";
                    $obj->idPlugin = "buque";
                    $obj->allowBlank = true;
                    $obj->tipo = 'textfield';
                    array_push($result, $obj);
                }
                if ($artib == 'calado') {
                    $obj = new stdClass();
                    $obj->label = 'Calado(mts)';
                    $obj->descripcion = 'Calado(mts)';
                    $obj->name = 'calado';
                    $obj->ownerPlugins = true;
                    $obj->namePlugin = "Datos del buque";
                    $obj->idPlugin = "buque";
                    $obj->allowBlank = true;
                    $obj->tipo = 'numberfield';
                    array_push($result, $obj);
                }
                if ($artib == 'eslora') {
                    $obj = new stdClass();
                    $obj->label = 'Eslora(mts)';
                    $obj->descripcion = 'Eslora(mts)';
                    $obj->name = 'eslora';
                    $obj->ownerPlugins = true;
                    $obj->namePlugin = "Datos del buque";
                    $obj->idPlugin = "buque";
                    $obj->allowBlank = true;
                    $obj->tipo = 'numberfield';
                    array_push($result, $obj);
                }
                if ($artib == 'manga') {
                    $obj = new stdClass();
                    $obj->label = 'Manga(mts)';
                    $obj->descripcion = 'Manga(mts)';
                    $obj->name = 'manga';
                    $obj->ownerPlugins = true;
                    $obj->namePlugin = "Datos del buque";
                    $obj->idPlugin = "buque";
                    $obj->allowBlank = true;
                    $obj->tipo = 'numberfield';
                    array_push($result, $obj);
                }
                if ($artib == 'muerto') {
                    $obj = new stdClass();
                    $obj->label = 'Peso muerto(ton)';
                    $obj->descripcion = 'Peso muerto(ton)';
                    $obj->name = 'muerto';
                    $obj->ownerPlugins = true;
                    $obj->namePlugin = "Datos del buque";
                    $obj->idPlugin = "buque";
                    $obj->allowBlank = true;
                    $obj->tipo = 'numberfield';
                    array_push($result, $obj);
                }
                if ($artib == 'neto') {
                    $obj = new stdClass();
                    $obj->label = 'Peso neto(ton)';
                    $obj->descripcion = 'Peso neto(ton)';
                    $obj->name = 'neto';
                    $obj->ownerPlugins = true;
                    $obj->namePlugin = "Datos del buque";
                    $obj->idPlugin = "buque";
                    $obj->allowBlank = true;
                    $obj->tipo = 'numberfield';
                    array_push($result, $obj);
                }
                if ($artib == 'bruto') {
                    $obj = new stdClass();
                    $obj->label = 'Peso bruto(ton)';
                    $obj->descripcion = 'Peso bruto(ton)';
                    $obj->name = 'bruto';
                    $obj->ownerPlugins = true;
                    $obj->namePlugin = "Datos del buque";
                    $obj->idPlugin = "buque";
                    $obj->allowBlank = true;
                    $obj->tipo = 'numberfield';
                    array_push($result, $obj);
                }
            }
        }
    }

}
