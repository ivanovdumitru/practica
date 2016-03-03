<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Doctrine\DBAL\Statement;

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
            //$search1['result'] = $connect->fetchAll("select DISTINCT Nm From companies");

            $stmt = $this->getDoctrine()->getManager()->getConnection()->prepare("select DISTINCT Nm From companies");
            $stmt->execute();
            $search1['result'] = $stmt->fetchAll();

            $Search_terms = explode(' ', $title); //splits search terms at spaces

            $searchCondition = ''; ////

            foreach($Search_terms as $i=>$term){
                if($i != 0){
                    $searchCondition .= ' OR ';
                }
                $searchCondition .=' Nm LIKE :term'.$i.' ';
            }

            $query = $this->getDoctrine()->getManager()->getConnection()->prepare("SELECT * FROM companies WHERE ".$searchCondition );
            foreach($Search_terms as $i=>$term){
                $query->bindValue(':term'.$i, $term);
            }
            $search['result'] = $query->fetchAll();
            $query->execute();

            $query1 = $this->getDoctrine()->getManager()->getConnection()->prepare("SELECT * FROM items WHERE Nm LIKE :title");
            $query1->bindValue(':title', $title);


            $query1->execute();
            $search1['result'] = $query1->fetchAll();


    
            $menuRepository = $this->getDoctrine()
                    ->getManager()
                    ->getRepository('AppBundle:Menu');
            $menu['result'] = $menuRepository->showAction();

            $data =[
                'search1'=>$search1['result'],
                'menu'=>$menu['result'],
                'shearch' => $search['result'],
                'search' => $search1['result'],
            ];
             return $this->render('AppBundle:Default:index2.html.twig',compact('data'));
        }
    }
}