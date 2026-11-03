<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of AbstractCompositeModel
 *
 * @author kenier
 */
abstract class AbstractCompositeModel extends BaseModel implements ICompositeModel
{
    /**
     *
     * @var Doctrine_Record
     */
    protected $baseModel;

    /**
     *
     * @var type
     */
    protected $listaPlugins;
    protected $baseAlias;
    protected $primaryKeyField;
    protected $interceptor;

    public function __construct()
    {
        parent::__construct();
        $this->listaPlugins = array();
        $this->initBaseModel();
        //  $this->interceptor = new BloqueoInterceptor($this);
//        return $this->interceptor;
    }

    abstract public function initBaseModel();

    public function buildRelations()
    {
        foreach ($this->listaPlugins as $pluginModel) {
            $pluginModel->initBaseRelation($this->baseModel);
        }
    }

    /**
     *
     * @return type
     */
    public function getBaseModel()
    {
        return $this->baseModel;
    }

    /**
     *
     * @return type
     */
    public function getListaPlugins()
    {
        return $this->listaPlugins;
    }

    public function getSelectQuery($parametros)
    {
        $query = $this->initBaseQuery($parametros);
            $pluginCount = 1;
            foreach ($this->listaPlugins as $pluginModel) {
                $pluginModel->addJoinModel(
                    $query, $this->baseAlias, $this->baseAlias.''.$pluginCount, true, $parametros
                );
                $pluginModel->addQueryFilters($query, $this->baseAlias.''.$pluginCount, $parametros);
                ++$pluginCount;          
        }
        return $query;
    }

    /**
     * @return Doctrine_Query Devuelve la cosnsulta base para el modelo de la clase Compuesta
     */
    public function initBaseQuery($parametros)
    {
        $query = Doctrine_Query::create()->from(get_class($this->baseModel).' '.$this->baseAlias);
        $query->addSelect($this->getQuerySelectFields($this->baseAlias));
        $this->addQueryFilters($query, $this->baseAlias, $parametros);
        return $query;
    }

    /**
     *
     */
    abstract public function getQuerySelectFields($alias);

    /**
     *
     */
    abstract public function addQueryFilters(Doctrine_Query $query, $aliasTabla, $parametros = array());

    public function setBaseAlias($baseAlias)
    {
        $this->baseAlias = $baseAlias;
    }

    /**
     *
     * @param ICompositeModel $plugin
     */
    public function attachPlugin(ICompositeModel $plugin)
    {
        array_push($this->listaPlugins, $plugin);
    }

    public function containsPlugin($pluginClass)
    {
        foreach ($this->listaPlugins as $plug) {
            if (get_class($plug) == $pluginClass) {
                return true;
            }
        }
        return false;
    }

    public function loadPluginsFromFile($config)
    {
        $plugins = LogisticaConfigHelper::__init()->loadConfig($config)->plugins;
        $dirApss = Zend_Registry::getInstance()->get('config')->dir_aplication;
        foreach ($plugins as $obj) {
            if ($obj['activo'] && !$this->containsPlugin($obj['clase'])) {
                $path = '';
                $dirPlugin = $dirApss.''.$obj['direccion'];
                $path .= PATH_SEPARATOR.$dirPlugin.DIRECTORY_SEPARATOR.'models/bussines';
                $path .= PATH_SEPARATOR.$dirPlugin.DIRECTORY_SEPARATOR.'models/domain';
                $path .= PATH_SEPARATOR.$dirPlugin.DIRECTORY_SEPARATOR.'models/domain/generated';
                set_include_path(get_include_path().$path);
                $plug = new $obj['clase'];
                if (is_subclass_of($plug, 'ICompositeModel')) {
                    $this->attachPlugin($plug);
                }
            }
        }
        return $this;
    }

    public function beforeSave(Doctrine_Record $model, $parametros = array())
    {
        if (isset($parametros[$this->primaryKeyField])) {
            $model->assignIdentifier($parametros[$this->primaryKeyField]);
        }
        $model->synchronizeWithArray($parametros);
        foreach ($this->listaPlugins as $plug) {
            $plug->beforeSave($model, $parametros);
        }
    }

    public function __call($method, $args)
    {
        if ($method[0] == "_") {
            $method = substr($method, 1);
        }
        if (method_exists($this, $method)) {
            $resp = $this->callMethod($method, $args);
            if ($resp) {
                array_push($args, $resp);
            }
        }
        foreach ($this->listaPlugins as $plug) {
            if (method_exists($this, $method)) {
                $this->callMethod($method, $args, $plug);
            }
        }
    }

    public function callMethod($method, $args, $context = null)
    {
        $context = is_null($context) ? $this : $context;
        return call_user_func_array(array($context, $method), $args);
    }

}
