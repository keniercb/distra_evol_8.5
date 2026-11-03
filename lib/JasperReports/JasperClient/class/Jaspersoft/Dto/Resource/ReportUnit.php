<?php
namespace Jaspersoft\Dto\Resource;

/**
 * Class ReportUnit
 * @package Jaspersoft\Dto\Resource
 */
class ReportUnit extends CompositeResource
{

    public $alwaysPromptControls;
    public $controlsLayout;
    public $inputControlRenderingView;
    public $reportRenderingView;
    public $dataSnapshotId;
    public $dataSource;
    public $query;
    public $jrxml;
    public $inputControls;
    public $resources;

    public static function createFromJSON($json_data, $type = null)
    {
        // Handle resources here as a special case
        if (!empty($json_data['resources']['resource'])) {
            $json_data['resources'] = $json_data['resources']['resource'];
            return parent::createFromJSON($json_data, $type);
        } else {
            return parent::createFromJSON($json_data, $type);
        }
    }

    public function jsonSerialize()
    {
        if (!empty($this->resources)) {
            $parent = parent::jsonSerialize();
            $parent_resources = $parent['resources'];
            unset($parent['resources']);
            $parent['resources']['resource'] = $parent_resources;
            return $parent;
        } else {
            return parent::jsonSerialize();
        }
    }

    /**
     * @return mixed
     */
    public function getAlwaysPromptControls()
    {
        return $this->alwaysPromptControls;
    }

    /**
     * @param mixed $alwaysPromptControls
     */
    public function setAlwaysPromptControls($alwaysPromptControls)
    {
        $this->alwaysPromptControls = $alwaysPromptControls;
    }

    /**
     * @return mixed
     */
    public function getControlsLayout()
    {
        return $this->controlsLayout;
    }

    /**
     * @param mixed $controlsLayout
     */
    public function setControlsLayout($controlsLayout)
    {
        $this->controlsLayout = $controlsLayout;
    }

    /**
     * @return mixed
     */
    public function getInputControlRenderingView()
    {
        return $this->inputControlRenderingView;
    }

    /**
     * @param mixed $inputControlRenderingView
     */
    public function setInputControlRenderingView($inputControlRenderingView)
    {
        $this->inputControlRenderingView = $inputControlRenderingView;
    }

    /**
     * @return mixed
     */
    public function getReportRenderingView()
    {
        return $this->reportRenderingView;
    }

    /**
     * @param mixed $reportRenderingView
     */
    public function setReportRenderingView($reportRenderingView)
    {
        $this->reportRenderingView = $reportRenderingView;
    }

    /**
     * @return mixed
     */
    public function getQuery()
    {
        return $this->query;
    }

    /**
     * @param mixed $query
     */
    public function setQuery($query)
    {
        $this->query = $query;
    }

    /**
     * @return mixed
     */
    public function getJrxml()
    {
        return $this->jrxml;
    }

    /**
     * @param mixed $jrxml
     */
    public function setJrxml($jrxml)
    {
        $this->jrxml = $jrxml;
    }

    /**
     * @return mixed
     */
    public function getInputControls()
    {
        return $this->inputControls;
    }

    /**
     * @param mixed $inputControls
     */
    public function setInputControls($inputControls)
    {
        $this->inputControls = $inputControls;
    }

    /**
     * @return mixed
     */
    public function getDataSource()
    {
        return $this->dataSource;
    }

    /**
     * @param mixed $dataSource
     */
    public function setDataSource($dataSource)
    {
        $this->dataSource = $dataSource;
    }

    /**
     * @return mixed
     */
    public function getDataSnapshotId()
    {
        return $this->dataSnapshotId;
    }

    /**
     * @param mixed $dataSnapshotId
     */
    public function setDataSnapshotId($dataSnapshotId)
    {
        $this->dataSnapshotId = $dataSnapshotId;
    }

}