<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
/**
 * @Template()
 */
class SearchController extends Controller
{
    /**
     *@Route("/search/", name="search")
     */
    public function indexAction(Request $request)
    {
        
        if ($request->getMEthod() == 'POST') {
            $title = $request->get('search');
            //echo "<div class=\"searchText\">Search Results</div><hr/>";
            $connect = $this->get('database_connection');
            $search1['result'] = $connect->fetchAll("select DISTINCT Nm From companies");
            $Search_terms = explode(' ', $title); //splits search terms at spaces
            $query = "SELECT * FROM companies WHERE ";
            $query1 = "SELECT * FROM items WHERE ";
              $t = mysql_real_escape_string($title);
                    $query .= "Nm LIKE '%$t%'";
                    $query1 .= "Nm LIKE '%$t%'";
            
            $searsh['result'] = $connect->fetchAll($query);
            $search['result'] = $connect->fetchAll($query1);
         
    
    $menuRepository = $this->getDoctrine()
                ->getManager()
                ->getRepository('AppBundle:Menu');
        $menu['result'] = $menuRepository->showAction();
    $data =[
        'search1'=>$search1['result'],
        'menu'=>$menu['result'],
        'shearch' => $searsh['result'],
        'search' => $search['result'],
    ];
 return $this->render('AppBundle:Default:index2.html.twig',compact('data'));
}}
}